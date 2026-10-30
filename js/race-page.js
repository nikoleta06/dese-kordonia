/* Σελίδα αγώνα (agonas-<id>.html / agonas-<id>-en.html, η γλώσσα από το <html lang>).
   Χρειάζεται τα js/weather-model.js και js/race-dates.js (φορτώνονται πριν). Τρία κομμάτια:

   - Αντίστροφη μέτρηση: με ώρα εκκίνησης (data-start-utc) μέρες, ώρες και λεπτά· χωρίς,
     μόνο μέρες. Αγώνας που πέρασε ή χωρίς ημερομηνία: «Μάρτιος 2027 · δεν έχει ανακοινωθεί».
   - Καιρός στην εκκίνηση: από το Open-Meteo, όταν μένουν έως 15 μέρες (τόσο φτάνει η
     πρόγνωση), για το σημείο της εκκίνησης (lat/lng του αγώνα), ώρα προς ώρα γύρω από την ώρα
     εκκίνησης. Το ίδιο μοντέλο ζέστης με το «Ρυθμός & Καιρός».
   - Προτεινόμενος ρυθμός (μόνο αγώνες δρόμου): ρυθμός και ενδιάμεσοι χρόνοι για τον χρόνο-στόχο,
     και πόσο τον αλλάζει ο καιρός της ώρας εκκίνησης. Ο στόχος μένει στο localStorage ανά αγώνα. */
(function () {
  'use strict';

  const EN = document.documentElement.lang === 'en';
  const lang = EN ? 'en' : 'el';
  const LOCALE = EN ? 'en-GB' : 'el-GR';
  const RD = window.DKRaceDates;
  const M = window.DKWeatherModel;
  const FORECAST_DAYS = 15; // η πρόγνωση του Open-Meteo: σήμερα + 15 μέρες
  const STORE_KEY = 'racePace';

  const T = EN ? {
    inDays: (n) => 'in ' + n + ' days',
    started: 'The race has started. Good luck to everyone running!',
    on: 'happening now',
    wxNoDate: 'The forecast appears here once the date is announced and the race is at most 15 days away.',
    wxLater: (d) => 'The forecast for race day appears here from ' + d + ' (15 days before).',
    loading: 'Loading the forecast…',
    netError: 'Could not reach the weather service. Check your connection and try again later.',
    start: 'start',
    pct: (est) => (est.upTo1 ? 'up to 1% slower' : 'about ' + est.pct + '% slower'),
    slower: (pct, a, b) => 'Estimated adjustment for this weather, ' + pct + ' for the same effort. For example ' + a + ' → ~' + b + ' /km. A practical approximation, not an exact measurement.',
    none: 'No pace adjustment needed: good conditions for racing.',
    temp: 'Temperature', feels: 'Feels like', dew: 'Dew point', hum: 'Humidity', wind: 'Wind', rain: 'Chance of rain',
    kmh: ' km/h',
    levels: { good: 'Ideal conditions', fair: 'Slightly warm', hard: 'Warm and humid', bad: 'Very hot', extreme: 'Dangerous heat' },
    marathon: 'Marathon', half: 'Half marathon', km: ' km',
    perKm: '/km',
    goalPace: 'pace for your goal',
    hint: 'Enter a goal time to see your pace.',
    invalid: 'That time gives a pace outside 2:00–20:00 /km. Check the hours and minutes.',
    wxPace: (pct, pace, time) => 'With the forecast for the start (estimated ' + pct + '), the same effort gives about ' + pace + ' /km, a finish time of around ' + time + '. Start at that pace, and if you feel good, speed up in the second half.',
    wxOk: 'The forecast for the start needs no adjustment: you can run your goal pace.',
    wxPending: 'When the forecast for race day is out, you will also see here how much the weather changes this pace.',
    split: 'Split', goalCol: 'Goal', wxCol: 'With the weather',
    finish: 'Finish'
  } : {
    inDays: (n) => 'σε ' + n + ' μέρες',
    started: 'Ο αγώνας ξεκίνησε. Καλή επιτυχία σε όσους τρέχουν!',
    on: 'σε εξέλιξη',
    wxNoDate: 'Η πρόγνωση θα εμφανιστεί εδώ όταν ανακοινωθεί η ημερομηνία και μείνουν έως 15 μέρες.',
    wxLater: (d) => 'Η πρόγνωση για τη μέρα του αγώνα θα εμφανιστεί εδώ από τις ' + d + ' (15 μέρες πριν).',
    loading: 'Φορτώνει η πρόγνωση…',
    netError: 'Δεν ήταν δυνατή η σύνδεση με την υπηρεσία καιρού. Έλεγξε τη σύνδεσή σου και δοκίμασε ξανά αργότερα.',
    start: 'εκκίνηση',
    pct: (est) => (est.upTo1 ? 'έως 1% πιο αργά' : 'περίπου ' + est.pct + '% πιο αργά'),
    slower: (pct, a, b) => 'Εκτιμώμενη προσαρμογή για αυτόν τον καιρό, ' + pct + ' με τον ίδιο κόπο. Π.χ. ' + a + ' → ~' + b + ' /χλμ. Είναι πρακτική προσέγγιση, όχι ακριβής μέτρηση.',
    none: 'Δεν χρειάζεται προσαρμογή του ρυθμού: καλές συνθήκες για αγώνα.',
    temp: 'Θερμοκρασία', feels: 'Αίσθηση', dew: 'Σημείο δρόσου', hum: 'Υγρασία', wind: 'Άνεμος', rain: 'Πιθανότητα βροχής',
    kmh: ' χλμ./ώρα',
    levels: { good: 'Ιδανικές συνθήκες', fair: 'Λίγη ζέστη', hard: 'Ζέστη και υγρασία', bad: 'Πολύ ζέστη', extreme: 'Επικίνδυνη ζέστη' },
    marathon: 'Μαραθώνιος', half: 'Ημιμαραθώνιος', km: ' χλμ.',
    perKm: '/χλμ.',
    goalPace: 'ρυθμός για τον στόχο σου',
    hint: 'Βάλε έναν χρόνο-στόχο για να δεις τον ρυθμό σου.',
    invalid: 'Αυτός ο χρόνος βγάζει ρυθμό έξω από το 2:00–20:00 /χλμ. Έλεγξε τις ώρες και τα λεπτά.',
    wxPace: (pct, pace, time) => 'Με την πρόγνωση για την εκκίνηση (εκτίμηση ' + pct + '), ο ίδιος κόπος βγάζει περίπου ' + pace + ' /χλμ., δηλαδή τελικό χρόνο γύρω στο ' + time + '. Ξεκίνα με αυτόν τον ρυθμό, κι αν νιώθεις καλά, ανέβασε στο δεύτερο μισό.',
    wxOk: 'Η πρόγνωση για την εκκίνηση δεν χρειάζεται προσαρμογή: μπορείς να τρέξεις τον ρυθμό του στόχου σου.',
    wxPending: 'Όταν βγει η πρόγνωση για τη μέρα του αγώνα, θα δεις εδώ και πόσο αλλάζει ο καιρός αυτόν τον ρυθμό.',
    split: 'Σημείο', goalCol: 'Στόχος', wxCol: 'Με τον καιρό',
    finish: 'Τερματισμός'
  };

  const $ = (id) => document.getElementById(id);
  const count = $('rpCount');
  if (!count || !RD) return;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  const num = (n, digits) => n.toLocaleString(LOCALE, { maximumFractionDigits: digits });
  function fmtPace(sec) {
    sec = Math.round(sec);
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }
  function fmtTime(sec) {
    sec = Math.round(sec);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = String(sec % 60).padStart(2, '0');
    return h ? h + ':' + String(m).padStart(2, '0') + ':' + s : m + ':' + s;
  }
  const hh = (h) => String(h).padStart(2, '0') + ':00';
  const fmtDay = (d, opts) => new Intl.DateTimeFormat(LOCALE, opts).format(d);

  const raceId = count.dataset.id;
  const startUtc = count.dataset.startUtc ? new Date(count.dataset.startUtc) : null;
  const startHour = count.dataset.start ? parseInt(count.dataset.start, 10) : null;

  /* ---------- Αντίστροφη μέτρηση ---------- */
  function renderCount() {
    const i = RD.info(count, RD.today());
    const timer = $('rpTimer');
    const status = $('rpStatus');
    const ics = $('rpIcs');
    if (!i.upcoming) {
      $('rpWhen').textContent = RD.pendingText(i, lang);
      timer.hidden = true;
      status.textContent = '';
      if (ics) ics.hidden = true; // οι σύνδεσμοι είναι για τη διοργάνωση που πέρασε
      return;
    }
    const oneDay = i.start.getTime() === i.end.getTime();
    $('rpWhen').textContent = (oneDay ? fmtDay(i.start, { weekday: 'long' }) + ' ' : '') + RD.dateText(i, lang, 'long');

    if (startUtc && startUtc > Date.now()) {
      const left = startUtc - Date.now();
      $('rpD').textContent = Math.floor(left / 864e5);
      $('rpH').textContent = Math.floor((left % 864e5) / 36e5);
      $('rpM').textContent = Math.floor((left % 36e5) / 6e4);
      timer.hidden = false;
      status.textContent = '';
    } else if (startUtc) {
      timer.hidden = true;
      status.textContent = T.started;
    } else {
      timer.hidden = true;
      status.textContent = RD.countdown(i, lang) || T.inDays(i.daysLeft);
    }
  }
  renderCount();
  setInterval(renderCount, 30 * 1000);

  // Το μενού του ημερολογίου κλείνει με κλικ έξω από αυτό, με Esc και μόλις διαλέξεις κάτι
  const cal = $('rpIcs');
  if (cal) {
    document.addEventListener('click', (e) => { if (cal.open && !cal.contains(e.target)) cal.open = false; });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cal.open) { cal.open = false; cal.querySelector('summary').focus(); }
    });
    cal.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { cal.open = false; }));
  }

  /* ---------- Καιρός στην εκκίνηση ---------- */
  let wxPct = null; // επιβράδυνση (%) στην ώρα εκκίνησης, όταν υπάρχει πρόγνωση
  const wx = $('rpWeather');

  function wxStatus(msg, isError) {
    const s = $('rpWxStatus');
    s.textContent = msg || '';
    s.classList.toggle('wp-error', !!isError);
  }

  async function loadWeather() {
    const i = RD.info(count, RD.today());
    if (!i.upcoming) { wxStatus(T.wxNoDate); return; }
    if (i.daysLeft > FORECAST_DAYS) {
      const from = new Date(i.start);
      from.setDate(from.getDate() - FORECAST_DAYS);
      wxStatus(T.wxLater(fmtDay(from, { day: 'numeric', month: 'long' })));
      return;
    }
    wxStatus(T.loading);
    const day = count.dataset.date;
    try {
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + wx.dataset.lat + '&longitude=' + wx.dataset.lng +
        '&hourly=temperature_2m,dew_point_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation_probability' +
        '&timezone=auto&start_date=' + day + '&end_date=' + day;
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      const h = (await res.json()).hourly;
      const hours = h.time.map((time, k) => ({
        hour: +time.slice(11, 13),
        t: h.temperature_2m[k], d: h.dew_point_2m[k], rh: h.relative_humidity_2m[k],
        feels: h.apparent_temperature[k], wind: h.wind_speed_10m[k],
        rain: h.precipitation_probability ? h.precipitation_probability[k] : null
      })).filter((x) => x.t != null && x.d != null);
      if (!hours.length) throw new Error('empty');
      hours.forEach((x) => { x.sum = M.heatSum(x.t, x.d); });
      wxStatus('');
      renderWeather(hours, i);
    } catch (e) {
      wxStatus(T.netError, true);
    }
  }

  function renderWeather(hours, i) {
    // Οι ώρες γύρω από την εκκίνηση (3 πριν, 5 μετά)· χωρίς ώρα εκκίνησης 06:00–14:00
    const center = startHour != null ? startHour : 9;
    const first = Math.max(0, center - 3);
    const last = Math.min(23, center + 5);
    const shown = hours.filter((x) => x.hour >= first && x.hour <= last);
    let selected = shown.find((x) => x.hour === center) || shown[0];
    const startX = startHour != null ? shown.find((x) => x.hour === startHour) : null;
    if (startX) wxPct = M.slowdownPct(startX.sum);

    const grid = $('rpWxGrid');
    $('rpWxIntro').hidden = false;
    function draw() {
      grid.replaceChildren();
      shown.forEach((x) => {
        const b = el('button', 'rp-hour lv-' + M.levelOf(x.sum) + (x === selected ? ' wp-sel' : ''));
        b.type = 'button';
        b.setAttribute('aria-pressed', x === selected ? 'true' : 'false');
        b.append(el('span', 'rp-hour-h', hh(x.hour)), el('span', 'rp-hour-t', Math.round(x.t) + '°'));
        if (x === startX) b.append(el('span', 'rp-hour-s', T.start));
        b.addEventListener('click', () => { selected = x; draw(); });
        grid.append(b);
      });
      detail(selected);
    }
    function detail(x) {
      const level = M.levelOf(x.sum);
      const pct = M.slowdownPct(x.sum);
      const isStart = x === startX;
      $('rpWxResult').hidden = false;
      $('rpWxWhen').textContent = fmtDay(i.start, { weekday: 'long', day: 'numeric', month: 'long' }) + ', ' +
        (isStart ? count.dataset.start + ' · ' + T.start : hh(x.hour));
      const badge = $('rpWxLevel');
      badge.className = 'wp-level lv-' + level;
      badge.textContent = T.levels[level];
      // Πρακτική εκτίμηση: ποσοστό χωρίς δεκαδικά, ρυθμός στα 5 δευτερόλεπτα (δες weather-model.js)
      const est = M.estimate(pct);
      $('rpWxDelta').textContent = est.none ? T.none : T.slower(T.pct(est), '5:00', fmtPace(300 + Math.max(5, M.round5(3 * pct))));
      const rows = [
        [T.temp, Math.round(x.t) + '°C'],
        [T.feels, Math.round(x.feels) + '°C'],
        [T.dew, Math.round(x.d) + '°C'],
        [T.hum, Math.round(x.rh) + '%'],
        [T.wind, Math.round(x.wind) + T.kmh]
      ];
      if (x.rain != null) rows.push([T.rain, Math.round(x.rain) + '%']);
      const tbody = $('rpWxRows');
      tbody.replaceChildren();
      rows.forEach(([k, v]) => {
        const tr = el('tr');
        tr.append(el('td', null, k), el('td', null, v));
        tbody.append(tr);
      });
    }
    draw();
    renderPace();
  }

  /* ---------- Προτεινόμενος ρυθμός ---------- */
  const paceBox = $('rpPace');
  const kms = paceBox && paceBox.dataset.km ? paceBox.dataset.km.split(',').map(Number) : [];

  function loadGoal() {
    try { return (JSON.parse(localStorage.getItem(STORE_KEY)) || {})[raceId] || null; } catch (e) { return null; }
  }
  function saveGoal(goal) {
    try {
      const all = JSON.parse(localStorage.getItem(STORE_KEY)) || {};
      all[raceId] = goal;
      localStorage.setItem(STORE_KEY, JSON.stringify(all));
    } catch (e) { /* ιδιωτική περιήγηση κ.λπ. */ }
  }

  // «42,2 χλμ.»: ο μαραθώνιος και ο ημιμαραθώνιος στρογγυλεμένοι, όπως τα λέμε
  const short = (km) => num(km === 42.195 ? 42.2 : km === 21.0975 ? 21.1 : km, 1) + T.km;
  const distLabel = (km) => km === 42.195 ? T.marathon + ' (' + short(km) + ')'
    : km === 21.0975 ? T.half + ' (' + short(km) + ')'
    : short(km);

  // Ενδιάμεσοι χρόνοι: κάθε 5 χλμ., το μισό του μαραθωνίου, και ο τερματισμός
  function splitPoints(km) {
    const pts = [];
    for (let k = 5; k < km - 0.5; k += 5) pts.push(k);
    if (km === 42.195) pts.push(21.0975);
    pts.sort((a, b) => a - b);
    pts.push(km);
    return pts;
  }

  function goalSec() {
    const h = parseInt($('rpGh').value, 10) || 0;
    const m = parseInt($('rpGm').value, 10) || 0;
    const s = parseInt($('rpGs').value, 10) || 0;
    return h * 3600 + m * 60 + s;
  }

  function renderPace() {
    if (!kms.length) return;
    const out = $('rpPaceOut');
    out.replaceChildren();
    const km = +$('rpDist').value;
    const total = goalSec();
    if (!total) { out.append(el('p', 'rp-hint', T.hint)); return; }
    const pace = total / km;
    if (pace < 120 || pace > 1200) { out.append(el('p', 'rp-hint wp-error', T.invalid)); return; }

    const big = el('div', 'pace');
    big.append(el('div', 'big', fmtPace(pace) + ' ' + T.perKm), el('span', 'label', T.goalPace));
    out.append(big);

    const adj = wxPct != null && wxPct >= 0.25 ? 1 + wxPct / 100 : null;
    if (wxPct != null) {
      // Ρυθμός στα 5 δευτερόλεπτα και χρόνος στο λεπτό: είναι εκτίμηση, όχι ακριβής πρόβλεψη
      out.append(el('p', 'wp-delta', adj
        ? T.wxPace(T.pct(M.estimate(wxPct)), fmtPace(pace + Math.max(5, M.round5(pace * wxPct / 100))),
          fmtTime(Math.round(total * adj / 60) * 60))
        : T.wxOk));
    } else {
      out.append(el('p', 'wp-delta', T.wxPending));
    }

    const table = el('table', 'rp-splits');
    const head = el('tr');
    head.append(el('th', null, T.split), el('th', null, T.goalCol));
    if (adj) head.append(el('th', null, T.wxCol));
    const thead = el('thead');
    thead.append(head);
    const tbody = el('tbody');
    splitPoints(km).forEach((p) => {
      const tr = el('tr');
      const name = p === km ? T.finish + ' (' + short(km) + ')'
        : p === 21.0975 ? T.half + ' (' + short(p) + ')'
        : short(p);
      tr.append(el('td', null, name), el('td', null, fmtTime(pace * p)));
      if (adj) tr.append(el('td', null, fmtTime(pace * adj * p)));
      tbody.append(tr);
    });
    table.append(thead, tbody);
    out.append(table);
  }

  if (kms.length) {
    const select = $('rpDist');
    kms.forEach((km) => {
      const o = el('option', null, distLabel(km));
      o.value = km;
      select.append(o);
    });
    const saved = loadGoal();
    if (saved && kms.includes(saved.km) && saved.sec > 0) {
      select.value = saved.km;
      $('rpGh').value = Math.floor(saved.sec / 3600) || '';
      $('rpGm').value = String(Math.floor((saved.sec % 3600) / 60)).padStart(2, '0');
      $('rpGs').value = String(saved.sec % 60).padStart(2, '0');
    }
    const onInput = () => {
      const sec = goalSec();
      if (sec) saveGoal({ km: +select.value, sec });
      renderPace();
    };
    ['rpGh', 'rpGm', 'rpGs'].forEach((id) => {
      const input = $(id);
      input.addEventListener('input', onInput);
      // Το ροδάκι του ποντικιού πάνω σε επιλεγμένο αριθμητικό πεδίο αλλάζει την τιμή του αντί να
      // κυλήσει τη σελίδα· το αποεπιλέγουμε, για να μην αλλάξει κατά λάθος ο στόχος
      input.addEventListener('wheel', () => input.blur(), { passive: true });
    });
    select.addEventListener('change', onInput);
    renderPace();
  }

  if (M) loadWeather();
})();
