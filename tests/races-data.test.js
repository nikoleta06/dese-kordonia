// Τεστ για το src/_data/races.js: ότι κάθε αγώνας έχει σωστά και πλήρη στοιχεία.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const races = require(path.join(__dirname, '..', 'src', '_data', 'races.js'));

test('κάθε αγώνας έχει μοναδικό id', () => {
  const ids = races.list.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length, 'υπάρχει id που επαναλαμβάνεται');
});

test('κάθε αγώνας έχει τα βασικά πεδία και στις δύο γλώσσες', () => {
  for (const r of races.list) {
    assert.ok(races.typeLabels[r.type], `${r.id}: άγνωστο type "${r.type}"`);
    assert.ok(['gr', 'eu'].includes(r.region), `${r.id}: region πρέπει να είναι gr ή eu`);
    assert.ok(r.month >= 1 && r.month <= 12, `${r.id}: month εκτός 1–12`);
    for (const lang of ['el', 'en']) {
      assert.ok(r.name[lang], `${r.id}: λείπει name.${lang}`);
      assert.ok(r.specs[lang], `${r.id}: λείπει specs.${lang}`);
      assert.match(r.url[lang], /^https?:\/\//, `${r.id}: url.${lang} δεν είναι σύνδεσμος`);
    }
    assert.ok(!Number.isNaN(parseFloat(r.lat)) && !Number.isNaN(parseFloat(r.lng)), `${r.id}: λάθος lat/lng`);
  }
});

test('οι ημερομηνίες είναι έγκυρες και ταιριάζουν με τον μήνα', () => {
  const day = (s) => new Date(s + 'T00:00');
  for (const r of races.list.filter((x) => x.date)) {
    assert.match(r.date, /^\d{4}-\d{2}-\d{2}$/, `${r.id}: date πρέπει να είναι ΕΕΕΕ-ΜΜ-ΗΗ`);
    assert.ok(!Number.isNaN(day(r.date).getTime()), `${r.id}: date δεν είναι πραγματική ημερομηνία`);
    assert.equal(day(r.date).getMonth() + 1, r.month, `${r.id}: το date δεν είναι στον μήνα ${r.month}`);
    if (r.dateEnd) {
      const days = (day(r.dateEnd) - day(r.date)) / 864e5;
      assert.ok(days >= 1 && days <= 7, `${r.id}: dateEnd πρέπει να είναι 1–7 μέρες μετά το date`);
    }
  }
});

test('η ώρα εκκίνησης (start) είναι ΩΩ:ΛΛ, μόνο με ημερομηνία, και η ζώνη ώρας (tz) υπάρχει', () => {
  for (const r of races.list) {
    if (r.start) {
      assert.ok(r.date, `${r.id}: start χωρίς date`);
      assert.match(r.start, /^([01]\d|2[0-3]):[0-5]\d$/, `${r.id}: start πρέπει να είναι ΩΩ:ΛΛ`);
    }
    if (r.tz) {
      assert.ok(r.start, `${r.id}: tz χωρίς start`);
      assert.doesNotThrow(() => new Intl.DateTimeFormat('en', { timeZone: r.tz }), `${r.id}: άγνωστη ζώνη ώρας "${r.tz}"`);
    }
    if (r.region === 'eu' && r.start) assert.ok(r.tz, `${r.id}: αγώνας εκτός Ελλάδας με start χρειάζεται tz`);
  }
});
