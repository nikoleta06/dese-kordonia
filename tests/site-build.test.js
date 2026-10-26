// Τεστ για τις σελίδες αγώνων στο _site (χρειάζεται πρώτα build: npm run build).
// Οι σελίδες φτιάχνονται με pagination, που εύκολα «χάνει» σελίδες από το sitemap και τα
// redirects (μόνο η πρώτη μπαίνει στις collections, και το data.permalink είναι ίδιο για όλες).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, '_site');
const races = require(path.join(ROOT, 'src', '_data', 'races.js'));
const built = fs.existsSync(SITE);
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
const URL = 'https://desekordonia.com/';

test('υπάρχει build για να ελεγχθεί', () => {
  assert.ok(built, 'δεν βρέθηκε _site: τρέξε πρώτα npm run build');
});

test('κάθε αγώνας έχει σελίδα στα ελληνικά και στα αγγλικά', { skip: !built }, () => {
  for (const r of races.list) {
    for (const f of [`agonas-${r.id}.html`, `agonas-${r.id}-en.html`]) {
      assert.ok(fs.existsSync(path.join(SITE, f)), `λείπει το ${f}`);
      assert.ok(read(f).includes(`<link rel="canonical" href="${URL}${f}">`), `${f}: λάθος canonical`);
    }
  }
});

test('το sitemap έχει κάθε σελίδα αγώνα, με τα ζεύγη ελληνικά/αγγλικά', { skip: !built }, () => {
  const sitemap = read('sitemap.xml');
  for (const r of races.list) {
    const el = `${URL}agonas-${r.id}.html`;
    const en = `${URL}agonas-${r.id}-en.html`;
    assert.ok(sitemap.includes(`<loc>${el}</loc>`), `sitemap: λείπει το ${el}`);
    assert.ok(sitemap.includes(`<loc>${en}</loc>`), `sitemap: λείπει το ${en}`);
    assert.ok(sitemap.includes(`hreflang="en" href="${en}"`), `sitemap: λείπει το hreflang για ${r.id}`);
  }
});

test('κάθε διεύθυνση του sitemap υπάρχει, μία φορά', { skip: !built }, () => {
  const locs = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.equal(new Set(locs).size, locs.length, 'διπλή διεύθυνση στο sitemap');
  for (const loc of locs) {
    const file = loc.slice(URL.length) || 'index.html';
    assert.ok(fs.existsSync(path.join(SITE, file)), `sitemap: δεν υπάρχει το ${file}`);
  }
});

test('τα redirects χωρίς .html καλύπτουν κάθε σελίδα αγώνα', { skip: !built }, () => {
  const redirects = read('_redirects');
  for (const r of races.list) {
    assert.ok(redirects.includes(`/agonas-${r.id} /agonas-${r.id}.html 301`), `_redirects: λείπει το agonas-${r.id}`);
  }
});

test('.ics για κάθε αγώνα με ημερομηνία, σε δύο γλώσσες, και κανένα για όσους δεν έχουν', { skip: !built }, () => {
  for (const r of races.list) {
    for (const f of [`ics/${r.id}.ics`, `ics/${r.id}-en.ics`]) {
      const exists = fs.existsSync(path.join(SITE, f));
      if (!r.date) { assert.ok(!exists, `${f}: αγώνας χωρίς ημερομηνία δεν χρειάζεται .ics`); continue; }
      assert.ok(exists, `λείπει το ${f}`);
      const ics = read(f);
      assert.match(ics, /^BEGIN:VCALENDAR\r\n[\s\S]*\r\nEND:VCALENDAR\r\n$/, `${f}: δεν είναι έγκυρο ημερολόγιο (με CRLF)`);
      assert.ok(ics.includes('UID:' + r.id + '-' + r.date + '@desekordonia.com'), `${f}: λάθος UID`);
    }
  }
});

test('ο σύνδεσμος «Πρόσθεσε στο ημερολόγιο» δείχνει σε αρχείο που υπάρχει', { skip: !built }, () => {
  for (const r of races.list) {
    for (const f of [`agonas-${r.id}.html`, `agonas-${r.id}-en.html`]) {
      const m = read(f).match(/id="rpIcs" href="([^"]+)"/);
      if (m) assert.ok(fs.existsSync(path.join(SITE, m[1])), `${f}: ο σύνδεσμος .ics δείχνει στο ${m[1]} που δεν υπάρχει`);
    }
  }
});
