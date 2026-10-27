/* «Πόση άσκηση φτάνει;» στη σελίδα Ευεξία (healthy.html / healthy-en.html).
   Τα λεπτά τρεξίματος και μέτριας άσκησης της εβδομάδας, σε σχέση με τις οδηγίες του ΠΟΥ (2020):
   150–300 λεπτά μέτριας ή 75–150 λεπτά έντονης άσκησης, όπου 1 λεπτό έντονης ≈ 2 λεπτά μέτριας.
   Δεν αποθηκεύει τίποτα. Το weekly() το ελέγχει το tests/activity-minutes.test.js. */
(function () {
  const BASE = 150;  // βασικός στόχος, σε λεπτά μέτριας άσκησης
  const UPPER = 300; // ανώτερος στόχος

  // run: λεπτά τρεξίματος (έντονη), moderate: λεπτά γρήγορου περπατήματος, ποδηλάτου κ.λπ.
  // eq: όλα σε ισοδύναμα λεπτά μέτριας. missing*: πόσα λείπουν ως τον επόμενο στόχο.
  function weekly(run, moderate) {
    const r = Math.max(0, Number(run) || 0);
    const m = Math.max(0, Number(moderate) || 0);
    const eq = Math.round(m + 2 * r);
    const goal = eq >= UPPER ? 'upper' : eq >= BASE ? 'base' : eq > 0 ? 'some' : 'none';
    const next = eq < BASE ? BASE : eq < UPPER ? UPPER : null;
    const missing = next ? next - eq : 0;
    return { eq, goal, missingRun: Math.ceil(missing / 2), missingModerate: missing };
  }

  window.DKActivity = { weekly, BASE, UPPER };

  if (typeof document === 'undefined') return;
  const tool = document.getElementById('amTool');
  if (!tool) return;

  const en = document.documentElement.lang === 'en';
  const min = (n) => n + (en ? (n === 1 ? ' minute' : ' minutes') : (n === 1 ? ' λεπτό' : ' λεπτά'));
  const T = en ? {
    none: 'Enter how many minutes you ran and walked briskly this week.',
    some: (w) => min(w.eq) + ' of moderate activity, counting each running minute twice. You need ' + min(w.missingRun) + ' more running, or ' + min(w.missingModerate) + ' of brisk walking, to reach the basic goal. Every minute counts.',
    base: (w) => min(w.eq) + ': you reached the WHO basic goal. For the upper goal (300) add ' + min(w.missingRun) + ' of running, or ' + min(w.missingModerate) + ' of brisk walking.',
    upper: (w) => min(w.eq) + ': you are past the upper goal too. Make sure you also have rest days.',
  } : {
    none: 'Γράψε πόσα λεπτά έτρεξες και πόσα περπάτησες γρήγορα αυτή την εβδομάδα.',
    some: (w) => min(w.eq) + ' μέτριας άσκησης, με κάθε λεπτό τρεξίματος να μετράει διπλό. Για τον βασικό στόχο σου λείπουν ' + min(w.missingRun) + ' τρεξίματος ή ' + min(w.missingModerate) + ' γρήγορου περπατήματος. Κάθε λεπτό μετράει.',
    base: (w) => min(w.eq) + ': πέτυχες τον βασικό στόχο του ΠΟΥ. Για τον ανώτερο (300) πρόσθεσε ' + min(w.missingRun) + ' τρεξίματος ή ' + min(w.missingModerate) + ' γρήγορου περπατήματος.',
    upper: (w) => min(w.eq) + ': ξεπέρασες και τον ανώτερο στόχο. Φρόντισε να έχεις και μέρες ξεκούρασης.',
  };

  const run = document.getElementById('amRun');
  const mod = document.getElementById('amMod');
  const fill = document.getElementById('amFill');
  const text = document.getElementById('amText');

  function render() {
    const w = weekly(run.value, mod.value);
    fill.style.width = Math.min(w.eq / UPPER, 1) * 100 + '%';
    tool.dataset.goal = w.goal;
    text.textContent = w.goal === 'none' ? T.none : T[w.goal](w);
  }

  tool.addEventListener('submit', (e) => e.preventDefault());
  [run, mod].forEach((input) => {
    input.addEventListener('input', render);
    // Η ροδέλα του ποντικιού πάνω σε πεδίο αριθμού αλλάζει την τιμή αντί να κυλά τη σελίδα
    input.addEventListener('wheel', () => input.blur(), { passive: true });
  });
  render();
})();
