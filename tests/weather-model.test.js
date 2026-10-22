// Τεστ για το js/weather-model.js: ο υπολογισμός ζέστης και επιβράδυνσης του ρυθμού.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

// Το αρχείο είναι γραμμένο για τον browser και γράφει στο window.DKWeatherModel.
// Στο Node δεν υπάρχει window, οπότε φτιάχνουμε ένα άδειο πριν το φορτώσουμε.
globalThis.window = globalThis.window || {};
require(path.join(__dirname, '..', 'js', 'weather-model.js'));
const { heatSum, slowdownPct, levelOf } = window.DKWeatherModel;

// Σύγκριση δεκαδικών: 0.1 + 0.2 δεν κάνει ακριβώς 0.3 στους υπολογιστές
const close = (actual, expected) =>
  assert.ok(Math.abs(actual - expected) < 1e-9, `περίμενα ${expected}, βγήκε ${actual}`);

test('heatSum: θερμοκρασία + σημείο δρόσου σε °F', () => {
  close(heatSum(0, 0), 64);        // 32 + 32
  close(heatSum(21, 15), 128.8);   // 69.8 + 59
});

test('slowdownPct: μέχρι 100 καμία επιβράδυνση', () => {
  assert.equal(slowdownPct(64), 0);
  assert.equal(slowdownPct(100), 0);
});

test('slowdownPct: τα όρια των κλιμάκων', () => {
  close(slowdownPct(110), 0.5);
  close(slowdownPct(120), 1);
  close(slowdownPct(140), 3);
  close(slowdownPct(180), 10);
});

test('slowdownPct: γραμμική παρεμβολή μέσα σε μια κλίμακα', () => {
  close(slowdownPct(125), 1.5);    // στη μέση του 120–130, που πάει από 1% σε 2%
});

test('slowdownPct: πάνω από 180 μένει 10%', () => {
  assert.equal(slowdownPct(200), 10);
});

test('slowdownPct: δεν μειώνεται ποτέ όσο ανεβαίνει η ζέστη', () => {
  let previous = 0;
  for (let sum = 90; sum <= 200; sum += 0.5) {
    const pct = slowdownPct(sum);
    assert.ok(pct >= previous, `στο ${sum} έπεσε από ${previous} σε ${pct}`);
    previous = pct;
  }
});

test('levelOf: τα πέντε επίπεδα και τα όριά τους', () => {
  assert.equal(levelOf(120), 'good');
  assert.equal(levelOf(121), 'fair');
  assert.equal(levelOf(140), 'fair');
  assert.equal(levelOf(141), 'hard');
  assert.equal(levelOf(161), 'bad');
  assert.equal(levelOf(181), 'extreme');
});