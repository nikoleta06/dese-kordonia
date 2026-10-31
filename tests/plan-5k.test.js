// Τεστ για το js/plan-5k.js: τι κρατάμε από το localStorage και ποια είναι η επόμενη προπόνηση.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

globalThis.window = globalThis.window || {};
require(path.join(__dirname, '..', 'js', 'plan-5k.js'));
const { parse, toggle, summary, WEEKS, PER_WEEK, TOTAL } = window.DKPlan5k;
const data = require(path.join(__dirname, '..', 'src', '_data', 'plan5k.js'));

const all = () => {
  const list = [];
  for (let w = 1; w <= WEEKS; w++) for (let s = 1; s <= PER_WEEK; s++) list.push(w + '-' + s);
  return list;
};

test('το js και ο πίνακας της σελίδας έχουν το ίδιο πλήθος εβδομάδων', () => {
  assert.equal(data.weeks.length, WEEKS);
  assert.equal(TOTAL, 24);
});

test('από το localStorage κρατάμε μόνο πραγματικές προπονήσεις, μία φορά την καθεμία', () => {
  assert.deepEqual(parse(null), []);
  assert.deepEqual(parse('όχι json'), []);
  assert.deepEqual(parse('{"a":1}'), []);
  assert.deepEqual(parse('["2-1","1-1","1-1","9-1","1-4",5]'), ['1-1', '2-1']);
});

test('το τικ προστίθεται και αφαιρείται, χωρίς διπλά', () => {
  let done = toggle([], '1-2', true);
  assert.deepEqual(done, ['1-2']);
  done = toggle(done, '1-2', true);
  assert.deepEqual(done, ['1-2']);
  assert.deepEqual(toggle(done, '1-2', false), []);
});

test('χωρίς τικ η επόμενη είναι η πρώτη προπόνηση', () => {
  const s = summary([]);
  assert.equal(s.count, 0);
  assert.deepEqual(s.next, { week: 1, session: 1 });
  assert.equal(s.finished, false);
});

test('η επόμενη περνά στην επόμενη εβδομάδα μετά την τρίτη προπόνηση', () => {
  assert.deepEqual(summary(['1-1', '1-2', '1-3']).next, { week: 2, session: 1 });
});

test('όποιος ξεκινά από πιο πάνω συνεχίζει από εκεί, όχι από την εβδομάδα 1', () => {
  const s = summary(['3-1']);
  assert.deepEqual(s.next, { week: 3, session: 2 });
  assert.equal(s.count, 1);
});

test('με τικ στην τελευταία και κενά πιο πριν, η επόμενη είναι η πρώτη κενή', () => {
  const s = summary(['8-3']);
  assert.deepEqual(s.next, { week: 1, session: 1 });
  assert.equal(s.finished, false);
});

test('με όλες τις προπονήσεις το πρόγραμμα έχει τελειώσει', () => {
  const s = summary(all());
  assert.equal(s.count, 24);
  assert.equal(s.finished, true);
  assert.equal(s.next, null);
});
