// Τεστ για το js/place-search.js: τι δείχνουμε όταν ο χρήστης ψάχνει νησί, χωριό, βουνό ή χώρα.
// Τα δεδομένα είναι απαντήσεις που έδωσαν το Open-Meteo και το OpenStreetMap, χωρίς κλήσεις στο δίκτυο.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

globalThis.window = globalThis.window || {};
require(path.join(__dirname, '..', 'js', 'place-search.js'));
const { norm, fromOsm, kindOf, isWide, mergePlaces, pickPlaces } = window.DKPlaceSearch;

const meteo = (name, feature_code, latitude, longitude, population = 0) =>
  ({ id: name + latitude, name, names: [norm(name)], feature_code, latitude, longitude, population });
const osm = (name, category, type, lat, lon, importance = 0.3, extra = {}) =>
  fromOsm([Object.assign({ place_id: 1, name, category, type, addresstype: type, lat: String(lat), lon: String(lon), importance }, extra)])[0];
const names = (list) => list.map((r) => r.name);

test('το αποτέλεσμα του OpenStreetMap παίρνει τη μορφή του Open-Meteo', () => {
  const r = osm('Κρήτη', 'place', 'island', 35.308, 24.463, 0.7, { address: { state: 'Κρήτη', country: 'Ελλάδα', country_code: 'gr' } });
  assert.equal(r.feature_code, 'ISL');
  assert.equal(r.latitude, 35.308);
  assert.equal(r.longitude, 24.463);
  assert.equal(r.population, 70000);
  assert.equal(r.admin1, 'Κρήτη');
  assert.equal(r.country_code, 'GR');
  assert.deepEqual(r.names, ['κρητη']);
});

test('από το OpenStreetMap μένουν εκτός δρόμοι και μαγαζιά', () => {
  const list = [
    { place_id: 1, name: 'Πλαστήρα', category: 'highway', type: 'residential', lat: '38', lon: '23' },
    { place_id: 2, name: 'Στενή', category: 'shop', type: 'convenience', lat: '38', lon: '23' },
    { place_id: 3, name: 'Κάτω Στενή', category: 'place', type: 'village', lat: '38', lon: '23' }
  ];
  assert.deepEqual(names(fromOsm(list)), ['Κάτω Στενή']);
});

test('στα διοικητικά όρια μετρά το είδος της περιοχής, και το άγνωστο είδος είναι περιοχή', () => {
  const country = osm('Ελλάδα', 'boundary', 'administrative', 39, 22, 0.86, { addresstype: 'country' });
  assert.equal(country.feature_code, 'PCLI');
  const village = osm('Lake Como', 'boundary', 'administrative', 40.1, -74, 0.44, { addresstype: 'village' });
  assert.equal(village.feature_code, 'PPL');
  assert.equal(osm('Κάτι', 'natural', 'plateau', 39, 22).feature_code, 'RGN');
});

test('αν λείπει το όνομα, παίρνουμε το πρώτο κομμάτι της πλήρους διεύθυνσης', () => {
  const [r] = fromOsm([{ place_id: 1, name: '', display_name: 'Πάρνηθα, Αττική, Ελλάδα', category: 'natural', type: 'mountain_range', lat: '38', lon: '23' }]);
  assert.equal(r.name, 'Πάρνηθα');
});

test('σημείωση για το κέντρο μόνο σε νησιά, βουνά και περιοχές', () => {
  assert.equal(kindOf({ feature_code: 'ISL' }), 'island');
  assert.equal(kindOf({ feature_code: 'LK' }), 'lake');
  assert.equal(kindOf({ feature_code: 'PPL' }), null);
  assert.equal(isWide({ feature_code: 'ISL' }), true);
  assert.equal(isWide({ feature_code: 'MT' }), true);
  assert.equal(isWide({ feature_code: 'ADM1' }), true);
  assert.equal(isWide({ feature_code: 'PPLA3' }), false);
  assert.equal(isWide({ feature_code: 'PRK' }), false);
});

test('το ίδιο μέρος από τις δύο πηγές μένει μία φορά, με το ελληνικό όνομα στο νησί', () => {
  const evia = pickPlaces([meteo('Εύβοια', 'ISL', 38.5, 24, 198130), osm('Εύβοια', 'place', 'island', 38.494, 23.911, 0.59)], 'ευβοια');
  assert.deepEqual(names(evia.results), ['Εύβοια']);
  const merged = mergePlaces([meteo('Nísos Kríti', 'ISL', 35.2, 24.9, 623065), osm('Κρήτη', 'place', 'island', 35.308, 24.463, 0.7)]);
  assert.deepEqual(names(merged), ['Κρήτη']);
});

test('μένουν χωριστά το νησί και η πόλη με το ίδιο όνομα, και όσα απέχουν πολύ', () => {
  const naxos = mergePlaces([meteo('Νάξος', 'ISL', 37.07, 25.49, 20561), meteo('Νάξος', 'PPLA3', 37.1, 25.38, 7070)]);
  assert.equal(naxos.length, 2);
  assert.equal(kindOf(naxos[0]), 'island');
  const olympus = mergePlaces([meteo('Όλυμπος', 'MT', 40.08, 22.35), meteo('Όλυμπος', 'MT', 34.94, 32.86)]);
  assert.equal(olympus.length, 2);
  const stenes = mergePlaces([osm('Ψαχνά', 'place', 'town', 38.57, 23.64), osm('Νέα Αρτάκη', 'place', 'town', 38.51, 23.64)]);
  assert.equal(stenes.length, 2);
});

test('η χώρα ζητά κάτι πιο συγκεκριμένο, εκτός αν υπάρχει μεγάλη πόλη με το ίδιο όνομα', () => {
  assert.equal(pickPlaces([meteo('Ελλάδα', 'PCLI', 39, 22, 10413962)], 'Ελλάδα').country, true);
  const germany = [meteo('Germany', 'PPL', 34.9, -83.5), meteo('Germany', 'PCLI', 51.5, 10.5, 83491249)];
  assert.equal(pickPlaces(germany, 'germany').country, true);
  const singapore = pickPlaces([meteo('Singapore', 'PPLC', 1.29, 103.85, 3547809), meteo('Singapore', 'PCLI', 1.36, 103.8, 5638676)], 'Singapore');
  assert.equal(singapore.country, false);
  assert.deepEqual(names(singapore.results), ['Singapore']);
  // Το OpenStreetMap δεν έχει πραγματικό πληθυσμό: η «σημαντικότητα» δεν κάνει το χωριό μεγάλη πόλη
  const fake = [osm('Germany', 'place', 'village', 34.9, -83.5, 0.8), osm('Germany', 'boundary', 'administrative', 51, 10, 0.9, { addresstype: 'country' })];
  assert.equal(pickPlaces(fake, 'Germany').country, true);
});

test('δείχνουμε το πολύ 6, τα πιο σημαντικά πρώτα, χωρίς αεροδρόμια και ξενοδοχεία', () => {
  const found = [meteo('Αεροδρόμιο', 'AIRP', 37.9, 23.9, 900000), meteo('Ξενοδοχείο', 'HTL', 37, 23, 800000)];
  for (let i = 1; i <= 8; i++) found.push(meteo('Χωριό ' + i, 'PPL', 30 + i, 20 + i, i * 100));
  const { results } = pickPlaces(found, 'χωριο');
  assert.deepEqual(names(results), ['Χωριό 8', 'Χωριό 7', 'Χωριό 6', 'Χωριό 5', 'Χωριό 4', 'Χωριό 3']);
});

test('το γνωστό μέρος του OpenStreetMap ανεβαίνει πάνω από τα χωριά με το ίδιο όνομα', () => {
  const found = [meteo('Lake Como', 'PPL', 40.16, -74.03, 1759), meteo('Lake Como', 'PPL', 41.85, -75.34), osm('Lake Como', 'water', 'lake', 45.99, 9.27, 0.56)];
  const { results } = pickPlaces(found, 'Lake Como');
  assert.equal(kindOf(results[0]), 'lake');
  assert.equal(results.length, 3);
});

test('τίποτα χρήσιμο σημαίνει κενή λίστα, όχι σφάλμα', () => {
  assert.deepEqual(pickPlaces([], 'asdfghjk'), { country: false, results: [], auto: false });
});

test('στενά και ύφαλοι στη θάλασσα μένουν εκτός', () => {
  const list = [
    { place_id: 1, name: 'Ύφαλος Παξών', category: 'natural', type: 'reef', lat: '39.22', lon: '20.17' },
    { place_id: 2, name: 'Στενό Παξών', category: 'natural', type: 'strait', lat: '39.3', lon: '20.13' }
  ];
  assert.deepEqual(fromOsm(list), []);
});

test('κατευθείαν στην πρόγνωση μόνο αν το μοναδικό μέρος είναι αυτό που γράφτηκε', () => {
  const island = () => osm('Εύβοια', 'place', 'island', 38.494, 23.911);
  assert.equal(pickPlaces([island()], 'ευβοια').auto, true);
  assert.equal(pickPlaces([meteo('Ηράκλειο', 'PPLA', 35.34, 25.13, 137000)], 'Ηράκλειο Κρήτης').auto, true);
  // Παρόμοιο όνομα: το δείχνουμε, αλλά ρωτάμε
  const steni = pickPlaces([osm('Στενή Δίρφυος', 'place', 'village', 38.58, 23.84)], 'Στενή Ευβοίας');
  assert.equal(steni.results.length, 1);
  assert.equal(steni.auto, false);
  // Δύο ή περισσότερα: πάντα ρωτάμε
  assert.equal(pickPlaces([meteo('Βουλιαγμένη', 'PPL', 37.81, 23.78), meteo('Βουλιαγμένη', 'PPL', 37.84, 21.61)], 'Βουλιαγμένη').auto, false);
});

test('το όνομα και από τις δύο πηγές μετρά για την αυτόματη επιλογή', () => {
  const { results, auto } = pickPlaces([meteo('Nísos Kríti', 'ISL', 35.2, 24.9, 623065), osm('Κρήτη', 'place', 'island', 35.308, 24.463, 0.7)], 'Κρήτη');
  assert.equal(results.length, 1);
  assert.equal(auto, true);
});

test('δύο νησιά με άλλο όνομα από την ίδια πηγή μένουν χωριστά, ακόμα κι αν είναι κοντά', () => {
  const near = mergePlaces([osm('Νησί Α', 'place', 'island', 37.6, 25.1), osm('Νησί Β', 'place', 'island', 37.5, 25.3)]);
  assert.equal(near.length, 2);
  const sameName = mergePlaces([osm('Πήλιο', 'natural', 'peak', 39.365, 23.136), osm('Πήλιο', 'natural', 'mountain_range', 39.438, 23.046)]);
  assert.equal(sameName.length, 1);
});
