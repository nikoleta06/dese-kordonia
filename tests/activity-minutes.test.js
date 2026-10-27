// Τεστ για το js/activity-minutes.js: τα λεπτά της εβδομάδας σε σχέση με τις οδηγίες του ΠΟΥ.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

globalThis.window = globalThis.window || {};
require(path.join(__dirname, '..', 'js', 'activity-minutes.js'));
const { weekly } = window.DKActivity;

test('κάθε λεπτό τρεξίματος μετράει όσο δύο μέτριας άσκησης', () => {
  assert.equal(weekly(75, 0).eq, 150);
  assert.equal(weekly(30, 60).eq, 120);
});

test('οι στόχοι: τίποτα, λίγο, βασικός (150), ανώτερος (300)', () => {
  assert.equal(weekly(0, 0).goal, 'none');
  assert.equal(weekly(10, 0).goal, 'some');
  assert.equal(weekly(0, 150).goal, 'base');
  assert.equal(weekly(150, 0).goal, 'upper');
});

test('πόσα λείπουν ως τον επόμενο στόχο, σε τρέξιμο και σε περπάτημα', () => {
  assert.deepEqual(weekly(20, 30), { eq: 70, goal: 'some', missingRun: 40, missingModerate: 80 });
  assert.deepEqual(weekly(0, 149), { eq: 149, goal: 'some', missingRun: 1, missingModerate: 1 });
  assert.deepEqual(weekly(100, 0), { eq: 200, goal: 'base', missingRun: 50, missingModerate: 100 });
  assert.deepEqual(weekly(200, 0), { eq: 400, goal: 'upper', missingRun: 0, missingModerate: 0 });
});

test('κενά, αρνητικά ή άκυρα πεδία μετράνε ως μηδέν', () => {
  assert.equal(weekly('', '').goal, 'none');
  assert.equal(weekly(-30, 'abc').eq, 0);
  assert.equal(weekly('45', '20').eq, 110);
});
