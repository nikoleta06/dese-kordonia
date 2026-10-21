/* Αρχική (index.html / index-en.html): η κάρτα καιρού και η σειρά των αγώνων.
   Χρειάζεται το js/weather-model.js (φορτώνεται πριν). Χωρίς JavaScript ή αν δεν απαντήσει
   το Open-Meteo, η κάρτα καιρού μένει όπως είναι: μια κάρτα που οδηγεί στο εργαλείο. */
(function () {
  'use strict';

  const EN = document.documentElement.lang === 'en';
  const $ = (id) => document.getElementById(id);

  /* ---------- Αγώνες: με σειρά επόμενης διοργάνωσης (το CSS δείχνει 3) ----------
     Όπου η ημερομηνία δεν έχει περάσει: «8 Νοε» και «σε 17 μέρες» στη θέση του μήνα. */
  const races = $('homeRaces');
  const RD = window.DKRaceDates;
  if (races && RD) {
    const lang = EN ? 'en' : 'el';
    const now = RD.today();
    RD.sort(races, 'li').forEach((li) => {
      const i = RD.info(li, now);
      if (!i.upcoming) return;
      const month = li.querySelector('.b-race-month');
      month.textContent = RD.dateText(i, lang, 'short');
      const left = RD.countdown(i, lang);
      if (left) {
        const small = document.createElement('small');
        small.className = 'b-race-countdown';
        small.textContent = left;
        month.append(small);
      }
    });
  }

  /* ---------- Καιρός ---------- */
  const card = $('homeWeather');
  const M = window.DKWeatherModel;
  if (!card || !M) return;

  const T = EN ? {
    now: 'now',
    today: 'Today',
    tomorrow: 'Tomorrow',
    noChange: 'no change needed',
    defaultCity: 'Showing Athens. Choose your city in the tool.',
    levels: { good: 'Ideal conditions', fair: 'Slightly warm', hard: 'Warm and humid', bad: 'Very hot', extreme: 'Dangerous heat' },
    texts: {
      good: 'A good day for a hard session.',
      fair: 'Heat costs a little. Start a bit more conservatively.',
      hard: 'Run by effort, not by pace, and take water.',
      bad: 'Keep it easy, or run early in the morning.',
      extreme: 'Not a day for running hard.'
    }
  } : {
    now: 'τώρα',
    today: 'Σήμερα',
    tomorrow: 'Αύριο',
    noChange: 'χωρίς αλλαγή',
    defaultCity: 'Δείχνει την Αθήνα. Διάλεξε την πόλη σου στο εργαλείο.',
    levels: { good: 'Ιδανικές συνθήκες', fair: 'Λίγη ζέστη', hard: 'Ζέστη και υγρασία', bad: 'Πολύ ζέστη', extreme: 'Επικίνδυνη ζέστη' },
    texts: {
      good: 'Καλή μέρα για δυνατή προπόνηση.',
      fair: 'Η ζέστη κοστίζει λίγο. Ξεκίνα πιο συντηρητικά.',
      hard: 'Τρέξε με την αίσθηση, όχι με τον ρυθμό, και πάρε νερό.',
      bad: 'Κράτα το χαλαρό ή τρέξε νωρίς το πρωί.',
      extreme: 'Δεν είναι μέρα για δυνατό τρέξιμο.'
    }
  };

  // Η πόλη και ο ρυθμός που έβαλε ο επισκέπτης στο εργαλείο (ίδιο κλειδί localStorage)
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('weatherPace')) || {}; } catch (e) { /* ιδιωτική περιήγηση κ.λπ. */ }
  const hasPlace = saved.place && typeof saved.place.lat === 'number' && typeof saved.place.lon === 'number';
  const place = hasPlace ? saved.place : { name: EN ? 'Athens' : 'Αθήνα', lat: 37.98, lon: 23.73 };

  const fmtPace = (sec) => {
    sec = Math.round(sec);
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  };
  const pctText = (pct) => '+' + pct.toLocaleString(EN ? 'en-GB' : 'el-GR', { maximumFractionDigits: 1 }) + '%';

  fetch('https://api.open-meteo.com/v1/forecast?latitude=' + place.lat + '&longitude=' + place.lon +
    '&hourly=temperature_2m,dew_point_2m&timezone=auto&forecast_days=2')
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then(render)
    .catch(() => { /* μένει η απλή κάρτα */ });

  function render(data) {
    const h = data.hourly;
    // Οι ώρες είναι τοπικές για την πόλη (timezone=auto)· το «τώρα» επίσης στην ώρα της πόλης
    const nowKey = new Date(Date.now() + data.utc_offset_seconds * 1000).toISOString().slice(0, 13);
    const hours = h.time.map((time, i) => ({
      key: time.slice(0, 13),
      date: time.slice(0, 10),
      hour: +time.slice(11, 13),
      t: h.temperature_2m[i],
      d: h.dew_point_2m[i]
    })).filter((x) => x.t != null && x.d != null);

    const now = hours.find((x) => x.key >= nowKey);
    if (!now) return;
    const sum = M.heatSum(now.t, now.d);
    const level = M.levelOf(sum);
    const pct = M.slowdownPct(sum);

    // Η πιο δροσερή ώρα (05:00–22:00) που απομένει σήμερα, αλλιώς αύριο
    const daytime = (x) => x.hour >= 5 && x.hour <= 22;
    const today = nowKey.slice(0, 10);
    let when = T.today;
    let pool = hours.filter((x) => x.date === today && daytime(x) && x.key >= nowKey);
    if (!pool.length) {
      when = T.tomorrow;
      pool = hours.filter((x) => x.date > today && daytime(x));
    }
    const best = pool.reduce((a, b) => (M.heatSum(b.t, b.d) < M.heatSum(a.t, a.d) ? b : a));

    $('hwTitle').textContent = place.name + ' · ' + T.now + ' ' + Math.round(now.t) + '°C';
    $('hwText').textContent = T.texts[level] + (hasPlace ? '' : ' ' + T.defaultCity);
    const badge = $('hwLevel');
    badge.className = 'wp-level lv-' + level;
    badge.textContent = T.levels[level];
    $('hwPace').textContent = saved.pace
      ? fmtPace(saved.pace) + ' → ' + fmtPace(saved.pace * (1 + pct / 100))
      : (pct < 0.25 ? T.noChange : pctText(pct));
    $('hwBest').textContent = when + ' ' + String(best.hour).padStart(2, '0') + ':00 · ' + Math.round(best.t) + '°C';
    $('hwStats').hidden = false;
  }
})();
