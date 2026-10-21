/* Ρυθμός & Καιρός: πόσο να «κόψεις» τον ρυθμό σου με βάση την πρόγνωση.
   Κοινό για τις σελίδες kairos-rythmos.html και kairos-rythmos-en.html (η γλώσσα από το <html lang>).
   Καιρός και αναζήτηση πόλης από το Open-Meteo (δωρεάν, χωρίς κλειδί), απευθείας από τον browser:
   τίποτα δεν περνά από τον δικό μας server. */
(function () {
  'use strict';

  const EN = document.documentElement.lang === 'en';
  const LOCALE = EN ? 'en-GB' : 'el-GR';
  const STORE_KEY = 'weatherPace';
  const FIRST_HOUR = 5;   // το πλέγμα δείχνει τις ώρες 05:00–22:00
  const LAST_HOUR = 22;
  const DAYS = 7;         // μετά τις 7 μέρες η πρόγνωση γίνεται πολύ αβέβαιη

  const T = EN ? {
    searching: 'Searching…',
    notFoundLatin: 'No city found with that name. Check the spelling, or write it in the local language (e.g. "München").',
    notFoundGreek: 'No city found with that name. If you entered a region or an island, enter the city or town instead. For a city outside Greece, write it in English or in Latin letters (e.g. "Milan", "Lisbon").',
    notFoundOther: 'No city found with that name. Write it in English or in Latin letters (e.g. "Moscow", "Tokyo").',
    isCountry: (q) => '"' + q + '" is a country. Enter a city or town, e.g. "Athens" or "London".',
    isRegion: (q) => '"' + q + '" is a region or an island, not a city. Enter the city or town where you will run.',
    loading: 'Loading the forecast…',
    netError: 'Could not reach the weather service. Check your connection and try again.',
    geoUnsupported: 'Your browser does not support location.',
    geoDenied: 'Location access was not allowed. Search for your city instead.',
    myLocation: 'My location',
    noHours: 'No more hours left in the forecast for today. Pick another day.',
    perKm: '/km',
    yourPace: 'your pace with good weather',
    adjusted: 'adjusted pace',
    noPace: 'Enter your pace to see the adjusted one.',
    slower: (pct, sec) => '+' + pct + '% (about ' + sec + ' s/km slower)',
    none: 'No adjustment needed',
    temp: 'Temperature', feels: 'Feels like', dew: 'Dew point', hum: 'Humidity',
    wind: 'Wind', rain: 'Chance of rain',
    levels: {
      good: 'Ideal conditions',
      fair: 'Slightly warm',
      hard: 'Warm and humid',
      bad: 'Very hot',
      extreme: 'Dangerous heat'
    },
    tips: {
      good: 'Good day for a hard session or a race. Run your usual pace.',
      fair: 'Heat starts to cost a little. Drink before you go and start a bit more conservatively.',
      hard: 'Run by effort or heart rate, not by pace. Take water with you on runs over 45 minutes and look for shade.',
      bad: 'Keep it easy, or move your run to the early morning. Water and electrolytes are a must, and drop any hard session.',
      extreme: 'Not a day for running hard. If you go out, keep it short and easy, close to water and shade, or move indoors.',
      rain: 'High chance of rain: a cap helps, and watch for slippery surfaces.',
      wind: 'Strong wind: start into the wind so it is behind you on the way back.',
      cold: 'Cold: dress in layers and start slightly faster than feels right, you will warm up within 10 minutes.',
      drift: 'Why your heart rate climbs in the heat: cardiac drift →'
    },
    best: 'coolest hour of the day',
    cellLabel: (day, h, t, d) => day + ' ' + h + ', ' + t + '°C, dew point ' + d + '°C'
  } : {
    searching: 'Αναζήτηση…',
    notFoundLatin: 'Δεν βρέθηκε πόλη με αυτό το όνομα. Έλεγξε την ορθογραφία ή γράψ’ τη στη γλώσσα της χώρας (π.χ. «München»).',
    notFoundGreek: 'Δεν βρέθηκε πόλη με αυτό το όνομα. Αν έγραψες περιοχή ή νησί, γράψε την πόλη ή το χωριό. Αν είναι πόλη του εξωτερικού, γράψ’ τη στα αγγλικά ή με λατινικούς χαρακτήρες (π.χ. «Milan», «Lisbon»).',
    notFoundOther: 'Δεν βρέθηκε πόλη με αυτό το όνομα. Γράψ’ τη στα αγγλικά ή με λατινικούς χαρακτήρες (π.χ. «Moscow», «Tokyo»).',
    isCountry: (q) => 'Το «' + q + '» είναι χώρα. Γράψε μια πόλη ή ένα χωριό, π.χ. «Αθήνα» ή «Λονδίνο».',
    isRegion: (q) => 'Το «' + q + '» είναι περιοχή ή νησί, όχι πόλη. Γράψε την πόλη ή το χωριό όπου θα τρέξεις.',
    loading: 'Φορτώνει η πρόγνωση…',
    netError: 'Δεν ήταν δυνατή η σύνδεση με την υπηρεσία καιρού. Έλεγξε τη σύνδεσή σου και δοκίμασε ξανά.',
    geoUnsupported: 'Ο browser σου δεν υποστηρίζει τοποθεσία.',
    geoDenied: 'Δεν δόθηκε πρόσβαση στην τοποθεσία. Αναζήτησε την πόλη σου.',
    myLocation: 'Η θέση μου',
    noHours: 'Δεν έχουν μείνει άλλες ώρες για σήμερα. Διάλεξε άλλη μέρα.',
    perKm: '/χλμ.',
    yourPace: 'ο ρυθμός σου με καλό καιρό',
    adjusted: 'προσαρμοσμένος ρυθμός',
    noPace: 'Βάλε τον ρυθμό σου για να δεις τον προσαρμοσμένο.',
    slower: (pct, sec) => '+' + pct + '% (περίπου ' + sec + '" πιο αργά ανά χλμ.)',
    none: 'Δεν χρειάζεται προσαρμογή',
    temp: 'Θερμοκρασία', feels: 'Αίσθηση', dew: 'Σημείο δρόσου', hum: 'Υγρασία',
    wind: 'Άνεμος', rain: 'Πιθανότητα βροχής',
    levels: {
      good: 'Ιδανικές συνθήκες',
      fair: 'Λίγη ζέστη',
      hard: 'Ζέστη και υγρασία',
      bad: 'Πολύ ζέστη',
      extreme: 'Επικίνδυνη ζέστη'
    },
    tips: {
      good: 'Καλή μέρα για δυνατή προπόνηση ή αγώνα. Τρέξε στον κανονικό σου ρυθμό.',
      fair: 'Η ζέστη αρχίζει να κοστίζει λίγο. Πιες νερό πριν βγεις και ξεκίνα λίγο πιο συντηρητικά.',
      hard: 'Τρέξε με βάση την αίσθηση ή τους παλμούς, όχι τον ρυθμό. Πάρε νερό μαζί σου αν τρέξεις πάνω από 45 λεπτά και ψάξε σκιά.',
      bad: 'Κράτα το χαλαρό ή μετάφερέ το νωρίς το πρωί. Νερό και ηλεκτρολύτες είναι απαραίτητα, και άφησε τη δυνατή προπόνηση για άλλη μέρα.',
      extreme: 'Δεν είναι μέρα για δυνατό τρέξιμο. Αν βγεις, κράτα το σύντομο και χαλαρό, κοντά σε νερό και σκιά, ή τρέξε σε κλειστό χώρο.',
      rain: 'Μεγάλη πιθανότητα βροχής: ένα καπέλο βοηθά, και πρόσεχε τις γλιστερές επιφάνειες.',
      wind: 'Δυνατός άνεμος: ξεκίνα κόντρα στον αέρα, ώστε στην επιστροφή να σε σπρώχνει.',
      cold: 'Κρύο: ντύσου σε στρώσεις και ξεκίνα με λίγο λιγότερα ρούχα απ’ όσα θέλεις, θα ζεσταθείς στα πρώτα 10 λεπτά.',
      drift: 'Γιατί ανεβαίνουν οι παλμοί στη ζέστη: cardiac drift →'
    },
    best: 'η πιο δροσερή ώρα της μέρας',
    cellLabel: (day, h, t, d) => day + ' ' + h + ', ' + t + '°C, σημείο δρόσου ' + d + '°C'
  };

  const $ = (id) => document.getElementById(id);

  /* ---------- Το μοντέλο: js/weather-model.js (κοινό με την κάρτα της αρχικής) ---------- */
  const { heatSum, slowdownPct, levelOf } = window.DKWeatherModel;

  /* ---------- Βοηθητικά ---------- */
  function fmtPace(sec) {
    sec = Math.round(sec);
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }
  const hh = (h) => String(h).padStart(2, '0') + ':00';
  // Οι ώρες του Open-Meteo είναι ήδη τοπικές για το μέρος (timezone=auto), π.χ. "2026-10-20T07:00".
  // Τις διαβάζουμε σαν κείμενο, ώστε να μη μπλέξει η ζώνη ώρας του browser.
  function dayName(dateStr, style) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Intl.DateTimeFormat(LOCALE, { weekday: style, timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)));
  }
  function dayLong(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Intl.DateTimeFormat(LOCALE, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
      .format(new Date(Date.UTC(y, m - 1, d)));
  }
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  function save(patch) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(Object.assign(load(), patch))); } catch (e) { /* ιδιωτική περιήγηση κ.λπ. */ }
  }
  function status(msg, isError) {
    const s = $('wpStatus');
    s.textContent = msg || '';
    s.classList.toggle('wp-error', !!isError);
  }

  /* ---------- Κατάσταση ---------- */
  let place = null;    // { name, lat, lon }
  let hours = [];      // [{ date, hour, t, d, rh, feels, wind, rain, sum, past }]
  let selected = null; // στοιχείο του hours
  let run = 0;         // αυξάνεται με το «Καθαρισμός»: απαντήσεις που έρχονται αργότερα αγνοούνται

  /* ---------- Ρυθμός ---------- */
  function paceSec() {
    const m = parseInt($('wpMin').value, 10) || 0;
    const s = parseInt($('wpSec').value, 10) || 0;
    const total = m * 60 + s;
    return total >= 120 && total <= 1200 ? total : null; // 2:00–20:00 /χλμ.
  }

  // ?pace=5:20 στο URL (για συνδέσμους από άλλα εργαλεία), αλλιώς ο τελευταίος που έβαλε ο χρήστης
  function initPace() {
    const fromUrl = new URLSearchParams(location.search).get('pace');
    const match = /^(\d{1,2}):(\d{2})$/.exec(fromUrl || '');
    const saved = load().pace;
    let sec = match ? +match[1] * 60 + +match[2] : saved;
    if (sec) {
      $('wpMin').value = Math.floor(sec / 60);
      $('wpSec').value = String(sec % 60).padStart(2, '0');
    }
    ['wpMin', 'wpSec'].forEach((id) => $(id).addEventListener('input', () => {
      const p = paceSec();
      if (p) save({ pace: p });
      renderResult();
    }));
  }

  /* ---------- Τοποθεσία ---------- */
  // Χωρίς τόνους, πεζά, ς → σ: «Κρήτης» και «κρητησ» συγκρίνονται ίδια
  const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ς/g, 'σ');

  // Το Open-Meteo ψάχνει μόνο με το όνομα του μέρους, σε μία γλώσσα κάθε φορά. Ρωτάμε
  // ελληνικά και αγγλικά μαζί (αλλιώς το «Heraklion» στην ελληνική σελίδα βρίσκει μόνο
  // το αεροδρόμιο) και κρατάμε τη γλώσσα της σελίδας όπου υπάρχει.
  async function geocode(name) {
    const langs = EN ? ['en', 'el'] : ['el', 'en'];
    const lists = await Promise.all(langs.map(async (lang) => {
      const res = await fetch('https://geocoding-api.open-meteo.com/v1/search?count=10&format=json&language=' +
        lang + '&name=' + encodeURIComponent(name));
      if (!res.ok) throw new Error(res.status);
      return (await res.json()).results || [];
    }));
    // Κρατάμε το όνομα και στις δύο γλώσσες: το νησί «Crete» στα ελληνικά λέγεται «Nísos Kríti»,
    // και η πόλη «Σιγκαπούρη» στα αγγλικά «Singapore»
    const byId = new Map();
    lists.flat().forEach((r) => {
      const known = byId.get(r.id);
      if (known) known.names.push(norm(r.name));
      else byId.set(r.id, Object.assign({}, r, { names: [norm(r.name)] }));
    });
    return [...byId.values()];
  }

  // Ταιριάζει η λέξη με την περιοχή ή τη χώρα του αποτελέσματος; Συγκρίνει την αρχή της
  // λέξης, ώστε η γενική να πιάνει την ονομαστική («Κρήτης» → «Κρήτη», «Αττικής» → «Αττική»).
  function inRegion(r, word) {
    const stem = word.slice(0, Math.max(3, word.length - 2));
    return [r.admin1, r.admin2, r.admin3, r.admin4, r.country]
      .some((a) => a && norm(a).split(/\s+/).some((part) => part.startsWith(stem)));
  }

  // «Ηράκλειο Κρήτης», «Ηράκλειο, Κρήτη», «Καλαμαριά Θεσσαλονίκη»: ψάχνει με μέρος των λέξεων
  // ως όνομα και φιλτράρει με τις υπόλοιπες ως περιοχή. Αν δεν ταιριάξει καμία περιοχή,
  // δείχνει ό,τι βρέθηκε για το πιο μεγάλο κομμάτι του ονόματος.
  async function findPlaces(q) {
    const words = q.split(/[\s,]+/).filter(Boolean).slice(0, 4);
    const tries = [];
    for (let n = words.length; n >= 1; n--) {
      tries.push({ name: words.slice(0, n), rest: words.slice(n) });
      if (n < words.length) tries.push({ name: words.slice(words.length - n), rest: words.slice(0, words.length - n) });
    }
    let fallback = [];
    for (const t of tries) {
      const found = await geocode(t.name.join(' '));
      const rest = t.rest.map(norm);
      const matched = found.filter((r) => rest.every((w) => inRegion(r, w)));
      if (matched.length) return matched;
      if (!fallback.length) fallback = found;
    }
    return fallback;
  }

  // Πόλεις πριν από αεροδρόμια και μικρά χωριά με το ίδιο όνομα
  const byPopulation = (a, b) => (b.population || 0) - (a.population || 0);

  // Τι λέμε όταν δεν βρέθηκε τίποτα: εξαρτάται από το αλφάβητο που έγραψε ο χρήστης.
  // Πολλές ξένες πόλεις δεν υπάρχουν με ελληνικό όνομα (π.χ. «Μιλάνο»), αλλά βρίσκονται στα αγγλικά.
  function notFoundMsg(q) {
    if (/[Ͱ-Ͽἀ-῿]/.test(q)) return T.notFoundGreek;
    if (/[^\u0000-ɏ\s.,'’-]/.test(q)) return T.notFoundOther;
    return T.notFoundLatin;
  }

  // Κωδικοί GeoNames: PPL* = πόλη/χωριό, PCL* = χώρα, ADM*/ISL*/RGN* = περιοχή, νησί κ.λπ.
  const isTown = (r) => !r.feature_code || r.feature_code.startsWith('PPL');
  const isCountry = (r) => /^PCL/.test(r.feature_code || '');
  const isRegion = (r) => /^(ADM|ISL|RGN|AREA|PEN|PRSH)/.test(r.feature_code || '');

  async function search() {
    const q = $('wpQuery').value.trim();
    if (q.length < 2) return;
    const myRun = run;
    const list = $('wpPlaces');
    list.replaceChildren();
    status(T.searching);
    try {
      const found = await findPlaces(q);
      if (myRun !== run) return;
      const sameName = (r) => r.names.includes(norm(q));
      const towns = found.filter(isTown).sort(byPopulation);
      // Μεγάλη πόλη με το ίδιο όνομα (Σιγκαπούρη, Λουξεμβούργο, Νέα Υόρκη): δεν είναι λάθος, τη δείχνουμε.
      // Αλλιώς «Ελλάδα», «Germany» είναι χώρα και «Crete» νησί, όχι τα χωριά των ΗΠΑ με το ίδιο όνομα.
      const bigTown = towns.some((r) => sameName(r) && (r.feature_code === 'PPLC' || (r.population || 0) >= 50000));
      if (!bigTown && found.some((r) => sameName(r) && isCountry(r))) { status(T.isCountry(q), true); return; }
      if (!bigTown && found.some((r) => sameName(r) && isRegion(r))) { status(T.isRegion(q), true); return; }
      const results = towns.slice(0, 6);
      if (!results.length) { status(notFoundMsg(q), true); return; }
      status('');
      results.forEach((r) => {
        const detail = [r.admin1, r.country].filter(Boolean).join(', ');
        const b = el('button', 'wp-place');
        b.type = 'button';
        b.append(el('strong', null, r.name), el('span', null, detail));
        b.addEventListener('click', () => {
          list.replaceChildren();
          choosePlace({ name: r.name + (r.country_code && r.country_code !== 'GR' ? ', ' + r.country : ''), lat: r.latitude, lon: r.longitude });
        });
        list.append(b);
      });
    } catch (e) {
      status(T.netError, true);
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) { status(T.geoUnsupported, true); return; }
    status(T.loading);
    const myRun = run;
    navigator.geolocation.getCurrentPosition(
      (pos) => myRun === run && choosePlace({
        name: T.myLocation,
        // 2 δεκαδικά (~1 χλμ.): αρκούν για την πρόγνωση και δεν στέλνουμε την ακριβή θέση
        lat: Math.round(pos.coords.latitude * 100) / 100,
        lon: Math.round(pos.coords.longitude * 100) / 100
      }),
      () => { if (myRun === run) status(T.geoDenied, true); },
      { timeout: 10000, maximumAge: 600000 }
    );
  }

  function choosePlace(p) {
    place = p;
    save({ place: p });
    $('wpPlaceName').textContent = p.name;
    $('wpPlaceBox').classList.remove('calc-hidden');
    $('wpSearchBox').classList.add('calc-hidden');
    fetchForecast();
  }

  /* ---------- Πρόγνωση ---------- */
  async function fetchForecast() {
    const myRun = run;
    status(T.loading);
    $('wpOut').classList.add('calc-hidden');
    try {
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + place.lat + '&longitude=' + place.lon +
        '&hourly=temperature_2m,dew_point_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation_probability' +
        '&timezone=auto&forecast_days=' + DAYS;
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      if (myRun !== run) return;
      const h = data.hourly;
      // «Τώρα» στην ώρα του μέρους, όχι του browser
      const nowLocal = new Date(Date.now() + data.utc_offset_seconds * 1000).toISOString().slice(0, 13);
      hours = h.time.map((time, i) => ({
        date: time.slice(0, 10),
        hour: +time.slice(11, 13),
        t: h.temperature_2m[i],
        d: h.dew_point_2m[i],
        rh: h.relative_humidity_2m[i],
        feels: h.apparent_temperature[i],
        wind: h.wind_speed_10m[i],
        rain: h.precipitation_probability[i],
        past: time.slice(0, 13) < nowLocal
      })).filter((x) => x.hour >= FIRST_HOUR && x.hour <= LAST_HOUR && x.t != null && x.d != null);
      hours.forEach((x) => { x.sum = heatSum(x.t, x.d); });
      status('');
      selected = hours.find((x) => !x.past) || null;
      renderGrid();
      renderResult();
      $('wpOut').classList.remove('calc-hidden');
    } catch (e) {
      if (myRun === run) status(T.netError, true);
    }
  }

  /* ---------- Πλέγμα ωρών ---------- */
  function renderGrid() {
    const grid = $('wpGrid');
    grid.replaceChildren();

    // Γραμμή με τις ώρες (ετικέτα κάθε 3 ώρες, για να χωρά στο κινητό)
    const head = el('div', 'wp-row wp-head');
    head.append(el('span', 'wp-day'));
    for (let hr = FIRST_HOUR; hr <= LAST_HOUR; hr++) {
      head.append(el('span', 'wp-hlabel', (hr - FIRST_HOUR) % 3 === 0 ? String(hr).padStart(2, '0') : ''));
    }
    grid.append(head);

    const dates = [...new Set(hours.map((x) => x.date))];
    dates.forEach((date) => {
      const row = el('div', 'wp-row');
      row.append(el('span', 'wp-day', dayName(date, 'short')));
      const dayHours = hours.filter((x) => x.date === date);
      const future = dayHours.filter((x) => !x.past);
      const best = future.length ? future.reduce((a, b) => (b.sum < a.sum ? b : a)) : null;
      for (let hr = FIRST_HOUR; hr <= LAST_HOUR; hr++) {
        const x = dayHours.find((y) => y.hour === hr);
        if (!x || x.past) { row.append(el('span', 'wp-cell wp-past')); continue; }
        const b = el('button', 'wp-cell lv-' + levelOf(x.sum) + (x === best ? ' wp-best' : '') + (x === selected ? ' wp-sel' : ''));
        b.type = 'button';
        b.setAttribute('aria-label', T.cellLabel(dayLong(date), hh(hr), Math.round(x.t), Math.round(x.d)) + (x === best ? ' (' + T.best + ')' : ''));
        b.setAttribute('aria-pressed', x === selected ? 'true' : 'false');
        b.title = dayName(date, 'short') + ' ' + hh(hr) + ' · ' + Math.round(x.t) + '°C';
        b.addEventListener('click', () => {
          selected = x;
          grid.querySelectorAll('.wp-sel').forEach((c) => { c.classList.remove('wp-sel'); c.setAttribute('aria-pressed', 'false'); });
          b.classList.add('wp-sel');
          b.setAttribute('aria-pressed', 'true');
          renderResult();
        });
        row.append(b);
      }
      grid.append(row);
    });
  }

  /* ---------- Αποτέλεσμα ---------- */
  function renderResult() {
    if (!selected) {
      if (hours.length) status(T.noHours);
      return;
    }
    const x = selected;
    const level = levelOf(x.sum);
    const pct = slowdownPct(x.sum);
    const pace = paceSec();

    $('wpWhen').textContent = dayLong(x.date) + ', ' + hh(x.hour) + (place ? ' · ' + place.name : '');

    const badge = $('wpLevel');
    badge.className = 'wp-level lv-' + level;
    badge.textContent = T.levels[level];

    if (pace) {
      const adj = pace * (1 + pct / 100);
      $('wpPace').textContent = fmtPace(adj);
      $('wpPaceLabel').textContent = T.adjusted + ' ' + T.perKm;
      $('wpDelta').textContent = pct < 0.25
        ? T.none
        : T.slower(pct.toLocaleString(LOCALE, { maximumFractionDigits: 1 }), Math.round(adj - pace)) +
          ' · ' + fmtPace(pace) + ' ' + T.yourPace;
    } else {
      $('wpPace').textContent = pct < 0.25 ? '0%' : '+' + pct.toLocaleString(LOCALE, { maximumFractionDigits: 1 }) + '%';
      $('wpPaceLabel').textContent = T.noPace;
      $('wpDelta').textContent = pct < 0.25 ? T.none : '';
    }

    const rows = [
      [T.temp, Math.round(x.t) + '°C'],
      [T.feels, Math.round(x.feels) + '°C'],
      [T.dew, Math.round(x.d) + '°C'],
      [T.hum, Math.round(x.rh) + '%'],
      [T.wind, Math.round(x.wind) + (EN ? ' km/h' : ' χλμ./ώρα')]
    ];
    if (x.rain != null) rows.push([T.rain, Math.round(x.rain) + '%']);
    const tbody = $('wpConditions');
    tbody.replaceChildren();
    rows.forEach(([k, v]) => {
      const tr = el('tr');
      tr.append(el('td', null, k), el('td', null, v));
      tbody.append(tr);
    });

    const tips = $('wpTips');
    tips.replaceChildren(el('li', null, T.tips[level]));
    if (x.rain >= 50) tips.append(el('li', null, T.tips.rain));
    if (x.wind >= 30) tips.append(el('li', null, T.tips.wind));
    if (x.feels <= 3) tips.append(el('li', null, T.tips.cold));
    if (level !== 'good') {
      const li = el('li');
      const a = el('a', null, T.tips.drift);
      a.href = EN ? 'post-cardiac-drift-en.html' : 'post-cardiac-drift.html';
      li.append(a);
      tips.append(li);
    }
  }

  /* ---------- Καθαρισμός ----------
     Σβήνει ρυθμό, πόλη και πρόγνωση, και από τη σελίδα και από το localStorage,
     ώστε την επόμενη φορά να ανοίγει άδειο. */
  function reset() {
    run++;
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ιδιωτική περιήγηση κ.λπ. */ }
    if (location.search) history.replaceState(null, '', location.pathname); // αλλιώς το ?pace= θα ξαναγέμιζε τον ρυθμό
    place = null;
    hours = [];
    selected = null;
    $('wpMin').value = '';
    $('wpSec').value = '';
    $('wpQuery').value = '';
    $('wpPlaces').replaceChildren();
    $('wpGrid').replaceChildren();
    $('wpOut').classList.add('calc-hidden');
    $('wpPlaceBox').classList.add('calc-hidden');
    $('wpSearchBox').classList.remove('calc-hidden');
    status('');
    $('wpMin').focus();
  }

  /* ---------- Εκκίνηση ---------- */
  $('wpReset').addEventListener('click', reset);
  initPace();
  $('wpSearchBtn').addEventListener('click', search);
  $('wpQuery').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); search(); } });
  $('wpGeoBtn').addEventListener('click', useMyLocation);
  $('wpChange').addEventListener('click', () => {
    $('wpSearchBox').classList.remove('calc-hidden');
    $('wpPlaceBox').classList.add('calc-hidden');
    $('wpQuery').focus();
  });

  const saved = load().place;
  if (saved && typeof saved.lat === 'number' && typeof saved.lon === 'number') choosePlace(saved);
})();
