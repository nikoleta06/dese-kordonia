/* Ρυθμός ανά τμήμα της διαδρομής, για αγώνες με course στο races.js (π.χ. ο Αυθεντικός).
   Φορτώνεται πριν από το js/race-page.js.

   Κάθε τμήμα έχει effect, πόσο % πιο αργά βγαίνει ο ίδιος κόπος από ό,τι στο επίπεδο. Βρίσκουμε
   έναν βασικό ρυθμό b ώστε Σ μήκος × b × (1 + effect/100) = χρόνος-στόχος, δηλαδή ίδιος κόπος σε
   όλη τη διαδρομή και τερματισμός ακριβώς στον στόχο. */
(function () {
  'use strict';

  // [{ from, to, pace, endSec }] για κάθε τμήμα (pace σε δευτερόλεπτα ανά χλμ.)
  function plan(segments, totalSec) {
    let from = 0;
    const weighted = segments.reduce((sum, s) => {
      const w = (s.to - from) * (1 + s.effect / 100);
      from = s.to;
      return sum + w;
    }, 0);
    const base = totalSec / weighted;
    let at = 0;
    let sec = 0;
    return segments.map((s) => {
      const pace = base * (1 + s.effect / 100);
      sec += (s.to - at) * pace;
      const row = { from: at, to: s.to, pace, endSec: sec };
      at = s.to;
      return row;
    });
  }

  // Ο χρόνος (δευτερόλεπτα) στο χιλιόμετρο km, με τον ρυθμό κάθε τμήματος
  function timeAt(rows, km) {
    let prev = 0;
    for (const r of rows) {
      if (km <= r.to) return prev + (km - r.from) * r.pace;
      prev = r.endSec;
    }
    return prev;
  }

  window.DKRaceCourse = { plan, timeAt };
})();
