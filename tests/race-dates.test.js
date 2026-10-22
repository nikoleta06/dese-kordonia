// Τεστ για το js/race-dates.js: ημερομηνίες, σειρά και αντίστροφη μέτρηση των αγώνων.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

globalThis.window = globalThis.window || {};
require(path.join(__dirname, '..', 'js', 'race-dates.js'));
const { info, dateText, countdown } = window.DKRaceDates;

// Στη σελίδα, κάθε αγώνας είναι ένα στοιχείο HTML με data-month / data-date / data-date-end.
// Το info() διαβάζει μόνο το .dataset, οπότε αρκεί ένα απλό αντικείμενο που του μοιάζει.
const race = (month, date, dateEnd) => ({
  dataset: { month: String(month), ...(date && { date }), ...(dateEnd && { dateEnd }) },
});

// Σταθερό «σήμερα», ώστε τα τεστ να δίνουν το ίδιο αποτέλεσμα όποια μέρα κι αν τρέξουν
const NOW = new Date(2026, 9, 22); // 22 Οκτωβρίου 2026 (οι μήνες στο Date μετρούν από το 0)

test('αγώνας με ημερομηνία που δεν πέρασε: upcoming και μέρες που μένουν', () => {
  const i = info(race(11, '2026-11-08'), NOW);
  assert.equal(i.upcoming, true);
  assert.equal(i.daysLeft, 17);
});

test('αγώνας που πέρασε: πάει στον ίδιο μήνα του επόμενου χρόνου', () => {
  const i = info(race(10, '2026-10-16'), NOW);
  assert.equal(i.upcoming, false);
  assert.equal(i.key, new Date(2027, 9, 16).getTime());
});

test('αγώνας πολλών ημερών που έχει ξεκινήσει: σε εξέλιξη', () => {
  const i = info(race(10, '2026-10-21', '2026-10-23'), NOW);
  assert.equal(i.upcoming, true);
  assert.equal(countdown(i, 'el'), 'σε εξέλιξη');
});

test('αγώνας χωρίς ημερομηνία: ο 15ος του μήνα, φέτος ή του χρόνου', () => {
  assert.equal(info(race(1), NOW).key, new Date(2027, 0, 15).getTime());  // Ιανουάριος → 2027
  assert.equal(info(race(12), NOW).key, new Date(2026, 11, 15).getTime()); // Δεκέμβριος → 2026
});

test('σειρά: πρώτα όσοι έρχονται, στο τέλος όσοι μόλις έγιναν', () => {
  const races = {
    athens: race(11, '2026-11-08'),
    rout: race(10, '2026-10-16'),     // πέρασε → Οκτώβριος 2027
    byzantine: race(1),               // χωρίς ημερομηνία → Ιανουάριος 2027
    venice: race(10, '2026-10-25'),
  };
  const order = Object.keys(races).sort((a, b) => info(races[a], NOW).key - info(races[b], NOW).key);
  assert.deepEqual(order, ['venice', 'athens', 'byzantine', 'rout']);
});

test('countdown: σήμερα, αύριο, σε Ν μέρες, και τίποτα μετά τις 60', () => {
  assert.equal(countdown({ daysLeft: 0 }, 'el'), 'σήμερα');
  assert.equal(countdown({ daysLeft: 1 }, 'el'), 'αύριο');
  assert.equal(countdown({ daysLeft: 17 }, 'el'), 'σε 17 μέρες');
  assert.equal(countdown({ daysLeft: 17 }, 'en'), 'in 17 days');
  assert.equal(countdown({ daysLeft: 61 }, 'el'), '');
});

test('dateText: μία μέρα, εύρος στον ίδιο μήνα, και στα αγγλικά', () => {
  assert.equal(dateText(info(race(11, '2026-11-08'), NOW), 'el', 'short'), '8 Νοε');
  assert.equal(dateText(info(race(11, '2026-11-28', '2026-11-29'), NOW), 'el', 'short'), '28–29 Νοε');
  assert.equal(dateText(info(race(11, '2026-11-08'), NOW), 'en', 'long'), '8 November');
});