/* Πρόοδος στο πρόγραμμα 5K: κουτάκια ανά προπόνηση στον πίνακα της σελίδας (programma-5k.html /
   programma-5k-en.html) και η κάρτα «πού έμεινες» της αρχικής. Τα τικ μένουν στον browser
   (localStorage), δεν φεύγουν προς κανέναν server. Χωρίς JavaScript ο πίνακας μένει όπως είναι.
   Τα parse/toggle/summary τα ελέγχει το tests/plan-5k.test.js. */
(function () {
  'use strict';

  const STORE_KEY = 'dk_plan5k';
  const WEEKS = 8;
  const PER_WEEK = 3;
  const TOTAL = WEEKS * PER_WEEK;

  // Όλες οι προπονήσεις με τη σειρά: «3-2» = εβδομάδα 3, προπόνηση 2
  const ALL = [];
  for (let w = 1; w <= WEEKS; w++) for (let s = 1; s <= PER_WEEK; s++) ALL.push(w + '-' + s);

  // Ό,τι κι αν βρεθεί στο localStorage, κρατάμε μόνο όσα είναι πραγματικές προπονήσεις
  function parse(raw) {
    let list;
    try { list = JSON.parse(raw); } catch (e) { return []; }
    return Array.isArray(list) ? ALL.filter((id) => list.includes(id)) : [];
  }

  function toggle(done, id, on) {
    return ALL.filter((x) => (x === id ? on : done.includes(x)));
  }

  // Η επόμενη είναι η πρώτη μετά την τελευταία που έγινε, όχι η πρώτη κενή: όποιος ξεκινά από
  // την εβδομάδα 3, επειδή ήδη τρέχει λίγο, δεν θέλει να του λέμε συνέχεια «εβδομάδα 1».
  // Αν έχει τικ και στην τελευταία αλλά λείπουν ενδιάμεσες, γυρίζουμε στην πρώτη κενή.
  function summary(done) {
    const lastDone = ALL.reduce((last, id, i) => (done.includes(id) ? i : last), -1);
    const nextId = ALL.slice(lastDone + 1).find((id) => !done.includes(id)) ||
      ALL.find((id) => !done.includes(id));
    const next = nextId ? { week: +nextId.split('-')[0], session: +nextId.split('-')[1] } : null;
    return { count: done.length, total: TOTAL, finished: !next, next, nextId: nextId || null };
  }

  window.DKPlan5k = { parse, toggle, summary, WEEKS, PER_WEEK, TOTAL };

  if (typeof document === 'undefined') return;

  const EN = document.documentElement.lang === 'en';
  const T = EN ? {
    count: (n, t) => n + ' of ' + t + ' workouts',
    label: 'Your progress in the 5K plan',
    session: (w, s) => 'Week ' + w + ', workout ' + s + ' of ' + PER_WEEK,
    next: (x) => 'Next, ' + x + '.',
    start: 'Tick each workout as soon as you finish it.',
    finished: 'You did all the workouts and reached 5K. Well done! 🎉',
    local: 'Your progress stays in this browser only, no account needed.',
    done: 'Done',
    reset: 'Start over',
    resetAsk: 'Clear your progress and start the plan over?',
    finishedHome: 'You reached 5K! 🎉',
    finishedText: 'You finished all the workouts of the plan.',
    continueHome: 'Continue the plan',
    seeHome: 'See the plan'
  } : {
    count: (n, t) => n + ' από ' + t + ' προπονήσεις',
    label: 'Η πρόοδός σου στο πρόγραμμα 5K',
    session: (w, s) => 'Εβδομάδα ' + w + ', προπόνηση ' + s + ' από ' + PER_WEEK,
    next: (x) => 'Επόμενη, ' + x + '.',
    start: 'Τσέκαρε κάθε προπόνηση μόλις την τελειώσεις.',
    finished: 'Έκανες όλες τις προπονήσεις και έφτασες στα 5 χλμ. Μπράβο! 🎉',
    local: 'Η πρόοδος μένει μόνο σε αυτόν τον browser, χωρίς λογαριασμό.',
    done: 'Έγινε',
    reset: 'Από την αρχή',
    resetAsk: 'Να σβηστεί η πρόοδός σου και να ξεκινήσεις το πρόγραμμα από την αρχή;',
    finishedHome: 'Έφτασες στα 5 χλμ! 🎉',
    finishedText: 'Ολοκλήρωσες όλες τις προπονήσεις του προγράμματος.',
    continueHome: 'Συνέχισε το πρόγραμμα',
    seeHome: 'Δες το πρόγραμμα'
  };

  // Αν ο browser δεν επιτρέπει αποθήκευση, τα τικ μένουν για όσο είναι ανοιχτή η σελίδα. Χωρίς αυτό
  // το κουτάκι θα ξετσεκαριζόταν μόνο του αμέσως μετά το πάτημα.
  let unsaved = null;
  function load() {
    if (unsaved) return unsaved;
    try { return parse(localStorage.getItem(STORE_KEY)); } catch (e) { return []; }
  }
  function save(done) {
    try {
      if (done.length) localStorage.setItem(STORE_KEY, JSON.stringify(done));
      else localStorage.removeItem(STORE_KEY);
    } catch (e) { unsaved = done; }
  }
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function bar(sum) {
    const p = el('progress', 'plan-bar');
    p.max = sum.total;
    p.value = sum.count;
    p.setAttribute('aria-label', T.label);
    return p;
  }

  /* ---------- Η σελίδα του προγράμματος ---------- */
  function initPlan(table) {
    const box = el('section', 'plan-progress');
    box.setAttribute('aria-label', T.label);
    table.closest('.table-wrap').before(box);

    const count = el('p', 'plan-count');
    const progress = bar(summary([]));
    const hint = el('p', 'plan-hint');
    hint.setAttribute('aria-live', 'polite');
    const foot = el('div', 'plan-foot');
    const reset = el('button', 'plan-reset', T.reset);
    reset.type = 'button';
    foot.append(el('span', null, T.local), reset);
    box.append(count, progress, hint, foot);

    const inputs = new Map();
    table.querySelectorAll('tbody tr[data-week]').forEach((tr) => {
      const week = +tr.dataset.week;
      const checks = el('div', 'plan-checks');
      checks.setAttribute('role', 'group');
      checks.setAttribute('aria-label', T.session(week, 1).split(',')[0]);
      checks.append(el('span', 'plan-checks-label', T.done));
      for (let s = 1; s <= PER_WEEK; s++) {
        const id = week + '-' + s;
        const label = el('label', 'plan-check');
        const input = el('input');
        input.type = 'checkbox';
        input.setAttribute('aria-label', T.session(week, s));
        input.addEventListener('change', () => {
          save(toggle(load(), id, input.checked));
          render();
        });
        label.append(input, el('span', null, String(s)));
        checks.append(label);
        inputs.set(id, input);
      }
      tr.lastElementChild.append(checks);
    });

    reset.addEventListener('click', () => {
      if (!window.confirm(T.resetAsk)) return;
      save([]);
      render();
    });

    function render() {
      const done = load();
      const sum = summary(done);
      count.textContent = T.count(sum.count, sum.total);
      progress.value = sum.count;
      hint.textContent = sum.finished ? T.finished
        : sum.count ? T.next(T.session(sum.next.week, sum.next.session))
        : T.start;
      box.classList.toggle('is-finished', sum.finished);
      reset.hidden = !sum.count;
      inputs.forEach((input, id) => {
        input.checked = done.includes(id);
        input.parentElement.classList.toggle('is-next', !!sum.count && id === sum.nextId);
      });
      table.querySelectorAll('tbody tr[data-week]').forEach((tr) => {
        tr.classList.toggle('plan-current', !!sum.count && !sum.finished && +tr.dataset.week === sum.next.week);
      });
    }

    render();
    // Με το «πίσω» ο browser μπορεί να δείξει την παλιά εικόνα της σελίδας από τη μνήμη
    window.addEventListener('pageshow', (e) => { if (e.persisted) render(); });
  }

  /* ---------- Η κάρτα της αρχικής: μόνο για όποιον έχει ξεκινήσει ---------- */
  function initHome(card) {
    const weeks = document.getElementById('homePlanWeeks').content.children;
    const title = card.querySelector('.b-title');
    const text = card.querySelector('.b-text');
    const more = card.querySelector('.b-more');
    const count = card.querySelector('.plan-count');
    const progress = bar(summary([]));
    count.after(progress);

    function render() {
      const sum = summary(load());
      card.hidden = !sum.count;
      if (!sum.count) return;
      count.textContent = T.count(sum.count, sum.total);
      progress.value = sum.count;
      title.textContent = sum.finished ? T.finishedHome : T.session(sum.next.week, sum.next.session);
      text.textContent = sum.finished ? T.finishedText : weeks[sum.next.week - 1].textContent;
      more.textContent = (sum.finished ? T.seeHome : T.continueHome) + ' →';
    }

    render();
    window.addEventListener('pageshow', (e) => { if (e.persisted) render(); });
  }

  const table = document.getElementById('planTable');
  if (table) initPlan(table);
  const card = document.getElementById('homePlan');
  if (card) initHome(card);
})();
