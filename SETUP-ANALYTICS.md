# Ρύθμιση analytics (GoatCounter)

Δωρεάν, **privacy-friendly** στατιστικά (χωρίς cookies, χωρίς banner συγκατάθεσης).
Δείχνει πόσοι επισκέπτες, ποιες σελίδες διαβάζονται και από πού έρχονται. ~3 λεπτά.

## 1. Φτιάξε λογαριασμό
1. Πήγαινε στο **https://www.goatcounter.com/** → «Sign up».
2. Διάλεξε ένα **code** (γίνεται το subdomain σου), π.χ. `desekordonia`
   → το site σου θα είναι `https://desekordonia.goatcounter.com`.
3. Βάλε email + password → δημιουργία.

## 2. Πάρε το URL μέτρησης
Είναι: `https://<TO_CODE_SOU>.goatcounter.com/count`
(π.χ. `https://desekordonia.goatcounter.com/count`)

## 3. Βάλ' το στον κώδικα
Άνοιξε `src/js/main.js`, βρες το σημείο «Analytics (GoatCounter)» και συμπλήρωσε:

```js
const GC = 'https://desekordonia.goatcounter.com/count';   // το δικό σου URL
```

Δεν χρειάζεται να το βάλεις σε κάθε σελίδα — το `main.js` φορτώνεται παντού και
προσθέτει αυτόματα το script.

## 4. Ανέβασέ το
Άλλαξε το `?v=` του `main.js` (π.χ. `?v=20` → `?v=21`) σε όλες τις σελίδες, commit & push.

## 5. Δες τα στατιστικά
Μπες στο `https://<TO_CODE_SOU>.goatcounter.com` — εκεί βλέπεις live επισκέψεις,
δημοφιλείς σελίδες, χώρες, referrers κ.λπ.

---

**Σημείωση:** Όσο το `GC` μένει κενό, δεν φορτώνεται κανένα analytics (μηδενική
επίπτωση). Είναι εντελώς προαιρετικό.
