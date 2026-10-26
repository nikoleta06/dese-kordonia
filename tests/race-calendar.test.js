// Τεστ για το js/race-calendar.js: οι μέρες του μήνα και ποιοι αγώνες μπαίνουν σε ποια μέρα.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

globalThis.window = globalThis.window || {};
require(path.join(__dirname, '..', 'js', 'race-dates.js'));
require(path.join(__dirname, '..', 'js', 'race-calendar.js'));
const { monthCells, events, onDay, pendingIn } = window.DKRaceCalendar;

// Όπως στο race-dates.test.js: ένα αντικείμενο που μοιάζει με στοιχείο HTML με data-*
const race = (month, date, dateEnd) => ({
  dataset: { month: String(month), ...(date && { date }), ...(dateEnd && { dateEnd }) },
});

const NOW = new Date(2026, 9, 26); // 26 Οκτωβρίου 2026

test('ο μήνας ξεκινά Δευτέρα και γεμίζει ολόκληρες εβδομάδες', () => {
  const cells = monthCells(2026, 10); // Νοέμβριος 2026: η 1η είναι Κυριακή
  assert.equal(cells.length % 7, 0);
  assert.equal(cells.slice(0, 6).every((c) => c === null), true);
  assert.equal(cells[6].getDate(), 1);
  assert.equal(cells.filter(Boolean).length, 30);
});

test('Φεβρουάριος δίσεκτου έτους: 29 μέρες', () => {
  assert.equal(monthCells(2028, 1).filter(Boolean).length, 29);
});

test('αγώνας με ημερομηνία που δεν πέρασε: στη μέρα του', () => {
  const athens = race(11, '2026-11-08');
  const { dated, pending } = events([athens], NOW);
  assert.equal(onDay(dated, new Date(2026, 10, 8))[0].item, athens);
  assert.equal(onDay(dated, new Date(2026, 10, 7)).length, 0);
  assert.equal(pending.length, 0);
});

test('αγώνας πολλών ημερών: σε κάθε μέρα του', () => {
  const { dated } = events([race(11, '2026-11-28', '2026-11-29')], NOW);
  assert.equal(onDay(dated, new Date(2026, 10, 28)).length, 1);
  assert.equal(onDay(dated, new Date(2026, 10, 29)).length, 1);
  assert.equal(onDay(dated, new Date(2026, 10, 30)).length, 0);
});

test('αγώνας που πέρασε: αχνός στη μέρα του, και χωρίς ημερομηνία τον ίδιο μήνα του χρόνου', () => {
  const { dated, pending } = events([race(10, '2026-10-11')], NOW);
  const past = onDay(dated, new Date(2026, 9, 11));
  assert.equal(past.length, 1);
  assert.equal(past[0].past, true);
  assert.equal(pendingIn(pending, 2027, 9).length, 1);
  assert.equal(pendingIn(pending, 2026, 9).length, 0);
});

test('αγώνας μόνο με μήνα: σε καμία μέρα, στη λίστα του μήνα του', () => {
  const { dated, pending } = events([race(3), race(12)], NOW);
  assert.equal(dated.length, 0);
  assert.equal(pendingIn(pending, 2027, 2).length, 1);  // Μάρτιος → 2027
  assert.equal(pendingIn(pending, 2026, 11).length, 1); // Δεκέμβριος → 2026
});
