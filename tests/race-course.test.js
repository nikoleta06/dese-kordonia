// Τεστ για το js/race-course.js: ο ρυθμός ανά τμήμα της διαδρομής.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

// Το αρχείο είναι γραμμένο για τον browser και γράφει στο window.DKRaceCourse.
globalThis.window = globalThis.window || {};
require(path.join(__dirname, '..', 'js', 'race-course.js'));
const { plan, timeAt } = window.DKRaceCourse;
const races = require(path.join(__dirname, '..', 'src', '_data', 'races.js'));

const close = (actual, expected, eps = 1e-6) =>
  assert.ok(Math.abs(actual - expected) < eps, `περίμενα ${expected}, βγήκε ${actual}`);

test('χωρίς κλίση ο ρυθμός είναι ίδιος παντού, ο μέσος του στόχου', () => {
  const rows = plan([{ to: 5, effect: 0 }, { to: 10, effect: 0 }], 3000);
  rows.forEach((r) => close(r.pace, 300));
  close(rows[1].endSec, 3000);
});

test('ο τερματισμός πέφτει ακριβώς στον στόχο, πιο αργά στην ανηφόρα, πιο γρήγορα στην κατηφόρα', () => {
  const rows = plan([{ to: 10, effect: 0 }, { to: 31, effect: 3 }, { to: 41, effect: -3 }, { to: 42.195, effect: 0 }], 4 * 3600);
  close(rows[rows.length - 1].endSec, 4 * 3600);
  assert.ok(rows[1].pace > rows[0].pace && rows[2].pace < rows[0].pace);
  close(rows[1].pace / rows[0].pace, 1.03);
});

test('timeAt: ο χρόνος σε ενδιάμεσο σημείο, μέσα και στα όρια των τμημάτων', () => {
  const rows = plan([{ to: 10, effect: 0 }, { to: 20, effect: 10 }], 2100); // 100 και 110 δ/χλμ.
  close(timeAt(rows, 5), 500);
  close(timeAt(rows, 10), 1000);
  close(timeAt(rows, 15), 1550);
  close(timeAt(rows, 20), 2100);
});

test('τα course του races.js είναι συνεχόμενα, τελειώνουν στην απόσταση και έχουν κείμενα και στις δύο γλώσσες', () => {
  for (const r of races.list.filter((x) => x.course)) {
    let prev = 0;
    for (const s of r.course.segments) {
      assert.ok(s.to > prev, `${r.id}: τα τμήματα πρέπει να ανεβαίνουν`);
      assert.ok(Math.abs(s.effect) < 15, `${r.id}: effect πολύ μεγάλο`);
      for (const lang of ['el', 'en']) assert.ok(s.name[lang] && s.tip[lang], `${r.id}: λείπει name/tip.${lang}`);
      prev = s.to;
    }
    assert.equal(prev, r.course.km, `${r.id}: το τελευταίο τμήμα πρέπει να φτάνει στο ${r.course.km}`);
  }
});
