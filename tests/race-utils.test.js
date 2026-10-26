// Τεστ για το scripts/race-utils.js: αποστάσεις, ώρα εκκίνησης σε UTC και αρχεία .ics των αγώνων.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const { distancesKm, startUtc, isUpcoming, raceIcs, calendarLinks, fold } = require(path.join(__dirname, '..', 'scripts', 'race-utils.js'));

const base = {
  id: 'test-race', type: 'road', month: 11, lat: '38.155', lng: '23.965',
  name: { el: 'Δοκιμαστικός Μαραθώνιος', en: 'Test Marathon' },
  specs: { el: '42,2 χλμ · Άσφαλτος', en: '42.2 km · Road' },
  url: { el: 'https://example.com/', en: 'https://example.com/en' },
};
const race = (extra) => ({ ...base, ...extra });

test('αποστάσεις από το specs: μαραθώνιος και ημιμαραθώνιος με την ακριβή απόσταση', () => {
  assert.deepEqual(distancesKm(race({ specs: { en: '42.2 / 21.1 / 10 km · Road' } })), [42.195, 21.0975, 10]);
  assert.deepEqual(distancesKm(race({ specs: { en: '21.1 & 5 km · Road' } })), [21.0975, 5]);
  assert.deepEqual(distancesKm(race({ specs: { en: '42.2 km & shorter · Road' } })), [42.195]);
  assert.deepEqual(distancesKm(race({ specs: { en: '42.2 / 21 / 10 / 3 km · Road' } })), [42.195, 21.0975, 10, 3]);
});

test('ορεινοί και υπερμαραθώνιοι: χωρίς αποστάσεις για ρυθμό', () => {
  assert.deepEqual(distancesKm(race({ type: 'mountain', specs: { en: '44 km · Mountain' } })), []);
  assert.deepEqual(distancesKm(race({ type: 'ultra', specs: { en: '246 km · Ultramarathon' } })), []);
});

test('ώρα εκκίνησης σε UTC: χειμερινή και θερινή ώρα Ελλάδας, άλλη ζώνη', () => {
  assert.equal(startUtc(race({ date: '2026-11-08', start: '08:30' })).toISOString(), '2026-11-08T06:30:00.000Z');
  assert.equal(startUtc(race({ date: '2027-04-11', start: '08:00' })).toISOString(), '2027-04-11T05:00:00.000Z');
  assert.equal(startUtc(race({ date: '2027-03-14', start: '08:00', tz: 'Europe/Rome' })).toISOString(), '2027-03-14T07:00:00.000Z');
  assert.equal(startUtc(race({ date: '2026-11-08' })), null);
});

test('isUpcoming: με τη μέρα που τρέχει το build', () => {
  const now = new Date(2026, 10, 8, 15, 0);
  assert.equal(isUpcoming(race({ date: '2026-11-08' }), now), true);
  assert.equal(isUpcoming(race({ date: '2026-11-07' }), now), false);
  assert.equal(isUpcoming(race({ date: '2026-11-07', dateEnd: '2026-11-08' }), now), true);
  assert.equal(isUpcoming(race({}), now), false);
});

const NOW = new Date(Date.UTC(2026, 9, 26, 12, 0, 0));

test('.ics με ώρα εκκίνησης: σε UTC, μία ώρα, υπενθύμιση μία μέρα πριν', () => {
  const ics = raceIcs(race({ date: '2026-11-08', start: '08:30' }), 'el', NOW);
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /\r\nDTSTART:20261108T063000Z\r\n/);
  assert.match(ics, /\r\nDTEND:20261108T073000Z\r\n/);
  assert.match(ics, /\r\nDTSTAMP:20261026T120000Z\r\n/);
  assert.match(ics, /\r\nTRIGGER:-P1D\r\n/);
  assert.match(ics, /\r\nUID:test-race-2026-11-08@desekordonia.com\r\n/);
  assert.match(ics, /\r\nEND:VCALENDAR\r\n$/);
});

test('.ics χωρίς ώρα: ολοήμερο, μέχρι και την τελευταία μέρα', () => {
  const ics = raceIcs(race({ date: '2026-11-28', dateEnd: '2026-11-29' }), 'en', NOW);
  assert.match(ics, /\r\nDTSTART;VALUE=DATE:20261128\r\n/);
  assert.match(ics, /\r\nDTEND;VALUE=DATE:20261130\r\n/); // το DTEND ολοήμερου είναι η επόμενη μέρα
  assert.match(ics, /\r\nSUMMARY:Test Marathon\r\n/);
});

test('.ics: κόμματα με backslash, γραμμές έως 75 bytes χωρίς κομμένους χαρακτήρες', () => {
  const ics = raceIcs(race({ date: '2026-11-08' }), 'el', NOW);
  assert.match(ics, /DESCRIPTION:42\\,2 χλμ/);
  for (const line of ics.split('\r\n')) {
    assert.ok(Buffer.byteLength(line, 'utf8') <= 75, 'γραμμή πάνω από 75 bytes: ' + line);
  }
  const long = 'SUMMARY:' + 'Αυθεντικός Μαραθώνιος Αθήνας '.repeat(4);
  assert.equal(fold(long).split('\r\n ').join(''), long);
});

test('σύνδεσμοι ημερολογίου με ώρα εκκίνησης: Google σε UTC, Outlook σε ISO', () => {
  const links = calendarLinks(race({ date: '2026-11-08', start: '08:30' }), 'el');
  const g = new URL(links.google);
  assert.equal(g.origin + g.pathname, 'https://calendar.google.com/calendar/render');
  assert.equal(g.searchParams.get('action'), 'TEMPLATE');
  assert.equal(g.searchParams.get('text'), 'Δοκιμαστικός Μαραθώνιος: εκκίνηση');
  assert.equal(g.searchParams.get('dates'), '20261108T063000Z/20261108T073000Z');
  assert.match(g.searchParams.get('details'), /agonas-test-race\.html$/);
  for (const key of ['outlook', 'office']) {
    const o = new URL(links[key]);
    assert.equal(o.searchParams.get('startdt'), '2026-11-08T06:30:00Z');
    assert.equal(o.searchParams.get('enddt'), '2026-11-08T07:30:00Z');
    assert.equal(o.searchParams.get('allday'), null);
  }
  assert.equal(new URL(links.outlook).host, 'outlook.live.com');
  assert.equal(new URL(links.office).host, 'outlook.office.com');
});

test('σύνδεσμοι ημερολογίου χωρίς ώρα: ολοήμεροι, μέχρι και την τελευταία μέρα', () => {
  const links = calendarLinks(race({ date: '2026-11-28', dateEnd: '2026-11-29' }), 'en');
  assert.equal(new URL(links.google).searchParams.get('dates'), '20261128/20261130');
  assert.equal(new URL(links.google).searchParams.get('text'), 'Test Marathon');
  const o = new URL(links.outlook);
  assert.equal(o.searchParams.get('startdt'), '2026-11-28');
  assert.equal(o.searchParams.get('enddt'), '2026-11-30');
  assert.equal(o.searchParams.get('allday'), 'true');
});
