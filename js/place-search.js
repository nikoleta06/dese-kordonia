/* Αναζήτηση μέρους στο «Ρυθμός & Καιρός»: ενώνει τα αποτελέσματα του Open-Meteo και του OpenStreetMap
   και αποφασίζει τι θα δει ο χρήστης. Δεν καλεί καμία υπηρεσία, αυτό το κάνει το js/weather-pace.js.
   Τα ελέγχει το tests/place-search.test.js. */
(function () {
  'use strict';

  // Χωρίς τόνους, πεζά, ς → σ: «Κρήτης» και «κρητησ» συγκρίνονται ίδια
  const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ς/g, 'σ');

  // Το Open-Meteo έχει κενά, δεν ξέρει π.χ. «Κρήτη», «Πάρνηθα» ή «Χαλκιδική». Ρωτάμε μαζί και το
  // OpenStreetMap και φέρνουμε τα αποτελέσματά του στη μορφή του Open-Meteo, με κωδικούς GeoNames.
  // Τα υπόλοιπα είδη του (δρόμοι, μαγαζιά, κτίρια) δεν είναι μέρη για πρόγνωση.
  const OSM_CODES = {
    country: 'PCLI', island: 'ISL', islet: 'ISL', archipelago: 'ISL',
    peak: 'MT', mountain_range: 'MT', ridge: 'MT', hill: 'MT', volcano: 'MT',
    park: 'PRK', garden: 'PRK', nature_reserve: 'PRK', stadium: 'PRK', track: 'PRK',
    lake: 'LK', reservoir: 'LK', beach: 'BCH', bay: 'BCH', cape: 'BCH', peninsula: 'PEN',
    city: 'PPL', town: 'PPL', village: 'PPL', hamlet: 'PPL', suburb: 'PPL', quarter: 'PPL',
    neighbourhood: 'PPL', locality: 'PPL', municipality: 'PPL', city_district: 'PPL'
  };
  // Ύφαλοι και στενά είναι στη θάλασσα: οι «Παξοί» έβγαζαν το «Στενό Παξών»
  function fromOsm(list) {
    return list.filter((r) => /^(place|natural|leisure|water|boundary)$/.test(r.category) && !/^(strait|reef|shoal)$/.test(r.type)).map((r) => {
      const a = r.address || {};
      const name = r.name || r.display_name.split(',')[0];
      return {
        id: 'osm' + r.place_id,
        osm: true,
        name,
        names: [norm(name)],
        latitude: +r.lat,
        longitude: +r.lon,
        feature_code: OSM_CODES[r.category === 'boundary' ? r.addresstype : r.type] || 'RGN',
        // Δεν δίνει πληθυσμό: η «σημαντικότητα» (0–1) παίρνει τη θέση του στην κατάταξη
        population: (r.importance || 0) * 100000,
        admin1: a.state || a.region || a.county,
        country: a.country,
        country_code: (a.country_code || '').toUpperCase()
      };
    });
  }

  // Κωδικοί GeoNames: PPL* = πόλη/χωριό, PCL* = χώρα, και τα είδη μέρους που δείχνουμε (όχι αεροδρόμια, ξενοδοχεία κ.λπ.)
  const isTown = (r) => !r.feature_code || r.feature_code.startsWith('PPL');
  const isCountry = (r) => /^PCL/.test(r.feature_code || '');
  const KINDS = [
    ['island', /^ISL/], ['mountain', /^(MT|PK|HLL|RDG)/], ['park', /^(PRK|RES|GDN|STDM)/], ['lake', /^(LK|RSV)/],
    ['beach', /^(BCH|BAY|CAPE)/], ['region', /^(ADM|RGN|AREA|PEN|PRSH|VAL|FRST)/]
  ];
  const kindOf = (r) => (KINDS.find(([, code]) => code.test(r.feature_code || '')) || [null])[0];
  // Σε αυτά η πρόγνωση αφορά το κέντρο τους, και οι δύο πηγές το τοποθετούν διαφορετικά
  const isWide = (r) => ['island', 'mountain', 'region'].includes(kindOf(r));

  // Τα πιο μεγάλα πρώτα. Το ίδιο μέρος από τις δύο πηγές μένει μία φορά, με το όνομα του
  // OpenStreetMap στα νησιά κ.λπ. («Κρήτη» αντί για «Nísos Kríti»). Από την ίδια πηγή, δύο νησιά ή
  // βουνά με άλλο όνομα είναι διαφορετικά μέρη, όσο κοντά κι αν είναι.
  function mergePlaces(found) {
    const merged = [];
    [...found].sort((a, b) => (b.population || 0) - (a.population || 0)).forEach((r) => {
      const near = isWide(r) ? 0.5 : 0.05;
      const same = merged.find((m) => kindOf(m) === kindOf(r) &&
        Math.abs(m.latitude - r.latitude) < near && Math.abs(m.longitude - r.longitude) < near &&
        (!isWide(r) || !m.osm !== !r.osm || m.names.some((n) => r.names.includes(n))));
      if (!same) { merged.push(r); return; }
      same.names = same.names.concat(r.names);
      if (r.osm && isWide(r)) same.name = r.name;
    });
    return merged;
  }

  // Γράφτηκε αυτό το μέρος; Το όνομα ή μια από τις λέξεις, ώστε να πιάνει το «Ηράκλειο Κρήτης»
  const namesMatch = (r, q) => {
    const words = norm(q).split(/[\s,]+/).filter(Boolean);
    return r.names.includes(norm(q)) || r.names.some((n) => words.includes(n));
  };

  function pickPlaces(found, q) {
    const sameName = (r) => r.names.includes(norm(q));
    // Μεγάλη πόλη με το ίδιο όνομα (Σιγκαπούρη, Λουξεμβούργο, Νέα Υόρκη): δεν είναι λάθος, τη δείχνουμε.
    // Αλλιώς «Ελλάδα», «Germany» είναι χώρα, όχι τα χωριά των ΗΠΑ με το ίδιο όνομα.
    const bigTown = found.some((r) => isTown(r) && sameName(r) && !r.osm && (r.feature_code === 'PPLC' || (r.population || 0) >= 50000));
    if (!bigTown && found.some((r) => sameName(r) && isCountry(r))) return { country: true, results: [], auto: false };
    const results = mergePlaces(found.filter((r) => isTown(r) || kindOf(r))).slice(0, 6);
    // Ένα μόνο μέρος πάει κατευθείαν στην πρόγνωση, αν είναι αυτό που γράφτηκε. Αν όχι, ρωτάμε.
    return { country: false, results, auto: results.length === 1 && namesMatch(results[0], q) };
  }

  window.DKPlaceSearch = { norm, fromOsm, kindOf, isWide, mergePlaces, pickPlaces };
})();
