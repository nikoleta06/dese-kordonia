/* Το μοντέλο του «Ρυθμός & Καιρός», κοινό για το εργαλείο (weather-pace.js) και την
   κάρτα καιρού της αρχικής (home.js). Φορτώνεται πριν από αυτά.

   Πρακτικός κανόνας που χρησιμοποιούν πολλοί προπονητές: άθροισμα θερμοκρασίας και
   σημείου δρόσου σε °F. Μέχρι 100 δεν χρειάζεται προσαρμογή· πάνω από 180 δεν
   συνιστάται δυνατό τρέξιμο. Ανάμεσα, το ποσοστό επιβράδυνσης ανεβαίνει κλιμακωτά
   (εδώ με γραμμική παρεμβολή μέσα σε κάθε κλίμακα, για να μην «πηδά» το αποτέλεσμα). */
(function () {
  'use strict';

  const BANDS = [ // [άνω όριο αθροίσματος °F, % στην αρχή της κλίμακας, % στο τέλος]
    [110, 0, 0.5],
    [120, 0.5, 1],
    [130, 1, 2],
    [140, 2, 3],
    [150, 3, 4.5],
    [160, 4.5, 6],
    [170, 6, 8],
    [180, 8, 10]
  ];
  const toF = (c) => c * 9 / 5 + 32;
  const heatSum = (tC, dC) => toF(tC) + toF(dC);

  function slowdownPct(sum) {
    if (sum <= 100) return 0;
    let from = 100;
    for (const [to, a, b] of BANDS) {
      if (sum <= to) return a + (b - a) * (sum - from) / (to - from);
      from = to;
    }
    return 10;
  }

  function levelOf(sum) {
    if (sum <= 120) return 'good';
    if (sum <= 140) return 'fair';
    if (sum <= 160) return 'hard';
    if (sum <= 180) return 'bad';
    return 'extreme';
  }

  window.DKWeatherModel = { heatSum, slowdownPct, levelOf };
})();
