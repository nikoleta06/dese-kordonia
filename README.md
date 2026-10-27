# Δέσε Κορδόνια 🏃

Προσωπική ιστοσελίδα για το τρέξιμο — έμπνευση, πρακτικές συμβουλές, εργαλεία και η προσωπική μου διαδρομή, από το πρώτο χιλιόμετρο μέχρι τον μαραθώνιο.

🔗 **Live:** https://desekordonia.com/

---

## Σελίδες
- **Αρχική** — πλέγμα «bento»: κάρτα με τον καιρό για τρέξιμο σήμερα, το πιο πρόσφατο άρθρο (με ετικέτα «Νέο» για 30 μέρες), οι επόμενοι αγώνες, τα εργαλεία, πρόσφατα άρθρα με κατηγορίες, σύντομα η ιστορία μου και newsletter
- **Ευεξία & Οφέλη** — πώς το τρέξιμο δυναμώνει σώμα και μυαλό
- **Blog** — άρθρα σε 4 κατηγορίες: Πρωταθλητές, Επιστήμη, Ιστορίες & Ψυχολογία, Πρακτικές
  - **Η Επιστήμη του Τρεξίματος** — συγκεντρωτική σελίδα με όλα τα επιστημονικά άρθρα (VO₂max, κατώφλι γαλακτικού, ζώνες παλμών, easy τρέξιμο, cadence)
- **Αγώνες** — διαδραστικός χάρτης με γνωστούς αγώνες δρόμου στην Ελλάδα
- **Σελίδα για κάθε αγώνα** (`agonas-<id>.html`) — αντίστροφη μέτρηση, «Πρόσθεσε στο ημερολόγιο» (.ics), καιρός στην εκκίνηση και ρυθμός για τον χρόνο-στόχο· δες `docs/adr/0003`
- **Εργαλεία**
  - Πρόγραμμα 5K (8 εβδομάδες)
  - Υπολογιστής Ρυθμού (pace + προβλέψεις χρόνων)
  - Ζώνες Καρδιακών Παλμών
  - Πρόβλεψη Χρόνου Αγώνα (5K / 10K / ημιμαραθώνιος / μαραθώνιος, με τον τύπο Riegel)
  - Ρυθμός & Καιρός — πόσο να κόψεις τον ρυθμό με τη ζέστη και την υγρασία της πρόγνωσης, και η πιο δροσερή ώρα για τρέξιμο τις επόμενες 7 μέρες, για κάθε πόλη του κόσμου
- **Αποθηκευμένα** — τα άρθρα που έχει σώσει ο επισκέπτης
- **Σχετικά** — ποια είμαι και γιατί ξεκίνησα το site
- **Λογαριασμός** — σύνδεση με σύνδεσμο στο email, με Face ID / δακτυλικό αποτύπωμα (passkey) ή με προαιρετικό κωδικό, προφίλ (όνομα, bio) και εγγραφή στο newsletter
- **Απόρρητο** — τι δεδομένα κρατάει το site, πού, και ποιες εξωτερικές υπηρεσίες χρησιμοποιεί (Cloudflare, Supabase, Render, Resend, GoatCounter, Open-Meteo)

Όλες οι σελίδες είναι **δίγλωσσες** (Ελληνικά / Αγγλικά).

## Χαρακτηριστικά
- **Δίγλωσσο** (EL/EN) με εναλλαγή γλώσσας
- **Dark / Light** θέμα (με μνήμη επιλογής)
- **Τρεις τρόποι σύνδεσης**: σύνδεσμος στο email (magic link), **passkey** (Face ID / δακτυλικό αποτύπωμα) και **προαιρετικός κωδικός**, με σελίδες επιβεβαίωσης (verify) και απεγγραφής (unsubscribe)
- **Newsletter** με σύνδεσμο και headers απεγγραφής ενός κλικ (`List-Unsubscribe`)
- **Προφίλ χρήστη** — όνομα & λίγα λόγια, αποθηκευμένα στον λογαριασμό
- **Like ανά άρθρο** (διατύπωση ανά κατηγορία) με **κοινό μέτρημα** μέσω Supabase
- **Αποθήκευση άρθρων** + σελίδα «Αποθηκευμένα» με ταξινόμηση
- **Χάρτης αγώνων** (Leaflet): φίλτρα ανά τύπο, χρωματιστά pins, λίστα-κάρτες με «δες στον χάρτη»
- **«Διάβασε επίσης»** σχετικά άρθρα στο τέλος κάθε post
- **Αρχική σε πλέγμα «bento»** (`src/_includes/home.njk`, κοινό για EL/EN): η κάρτα καιρού δείχνει την πόλη και τον ρυθμό που έβαλε ο επισκέπτης στο «Ρυθμός & Καιρός» (αλλιώς την Αθήνα), οι αγώνες μπαίνουν σε σειρά από τον τρέχοντα μήνα, και οι κατηγορίες ανοίγουν το blog φιλτραρισμένο (`blog.html?cat=science`)
- **Ρυθμός & Καιρός**: πρόγνωση από το Open-Meteo, πλέγμα 7 μερών × 05:00–22:00 χρωματισμένο ανάλογα με τη ζέστη, προσαρμοσμένος ρυθμός, συμβουλές, κουμπί «Καθαρισμός» και έξυπνη αναζήτηση πόλης (ελληνικά και αγγλικά, «Ηράκλειο Κρήτης», ειδοποίηση όταν γράφεις χώρα ή περιοχή)
- **Αναζήτηση** σε άρθρα και εργαλεία (Pagefind), ξεχωριστά για ελληνικά και αγγλικά — εικονίδιο στο μενού, `search.html?q=…`
- **Ομαλές μεταβάσεις** ανάμεσα στις σελίδες (View Transitions) και **prefetch** της σελίδας που πας να ανοίξεις (Speculation Rules)
- **Analytics** (GoatCounter, privacy-friendly)
- **SEO**: sitemap.xml (παράγεται αυτόματα, με hreflang), robots.txt, Open Graph, Schema.org, hreflang, custom 404
- **Ασφάλεια**: Content-Security-Policy, HSTS και άλλα security headers μέσω Cloudflare (δες `_headers`)
- **Εικονογραφημένη ταυτότητα** (σταθερός χαρακτήρας-μασκότ σε όλες τις κατηγορίες)
- **Responsive** για κινητό, tablet και υπολογιστή

## Τεχνολογία
Στατική ιστοσελίδα, χτισμένη με **[Eleventy](https://www.11ty.dev/)** (Nunjucks templates) σε **Node 24 LTS**:
- **Eleventy** — κοινό layout (`src/_includes/base.njk`) για head/menu/footer, ώστε μια αλλαγή στο μενού ή στο footer να μην χρειάζεται να γίνει σε δεκάδες αρχεία
- **Άρθρα σε Markdown** (`src/posts/*.md`) με κοινό layout (`src/_includes/post.njk`): meta tags, Open Graph, JSON-LD, ημερομηνία/κατηγορία, εικόνα και «Διάβασε επίσης» φτιάχνονται από το front matter — δες [NEO-ARTHRO.md](NEO-ARTHRO.md)
- **HTML5 & CSS** (CSS custom properties, dark/light theme)
- **Fonts από το ίδιο το site** (Inter, Roboto Condensed — `@fontsource`, μόνο Latin + ελληνικά), χωρίς Google Fonts
- **[Pagefind](https://pagefind.app/)** — στατική αναζήτηση· το ευρετήριο φτιάχνεται στο τέλος κάθε build
- **Vanilla JavaScript** (`js/main.js`) — theme, μενού, φίλτρα blog, like/save, σχετικά άρθρα, analytics
  - `js/passkey.js` και `js/password.js` — σύνδεση με passkey και με κωδικό
  - `js/weather-pace.js` — το εργαλείο «Ρυθμός & Καιρός» (κοινό για ελληνικά και αγγλικά)
- **[Leaflet](https://leafletjs.com/)** — διαδραστικός χάρτης αγώνων (σερβίρεται από το site, `vendor/leaflet-1.9.4/`)
- **[Supabase](https://supabase.com/)** — κοινό μέτρημα στα like (`article_likes`, REST + RPC)
- **Custom backend API** (`api.desekordonia.com`, `localhost:4000` σε dev) — σύνδεση (magic link, passkey, κωδικός), προφίλ χρήστη & newsletter (`/api/auth/*`, `/api/profile`, `/api/newsletter/*`)
- **[Open-Meteo](https://open-meteo.com/)** — πρόγνωση καιρού και αναζήτηση πόλης για το «Ρυθμός & Καιρός»· δωρεάν, χωρίς κλειδί, καλείται απευθείας από τον browser
- **[GoatCounter](https://www.goatcounter.com/)** — στατιστικά επισκεψιμότητας
- **[Cloudflare Workers](https://developers.cloudflare.com/workers/)** — φιλοξενία του site, με security headers και redirects

## Δομή
```
robots.txt
favicon.ico, favicon.png    # εικονίδιο site (και στο images/)
package.json, .eleventy.js  # ρύθμιση Eleventy
wrangler.jsonc              # ρύθμιση Cloudflare Workers
_headers                    # security headers (CSP κ.λπ.) και cache για το Cloudflare
.github/workflows/deploy.yml  # build + deploy στο Cloudflare και preview σε κάθε PR
NEO-ARTHRO.md               # πώς γράφεις νέο άρθρο
src/
  _includes/
    base.njk                # το κοινό layout (head, header/nav, footer)
    post.njk                # το layout των άρθρων (πάνω στο base.njk)
    author-box.njk          # πλαίσιο συγγραφέα στο τέλος των άρθρων
    related.njk             # «Διάβασε επίσης» — 3 σχετικά άρθρα
    home.njk                # η αρχική (EL & EN): hero + πλέγμα bento
    search-script.njk       # Pagefind UI (κοινό για search / search-en)
  _data/
    nav.js                  # στοιχεία μενού (κύριο + dropdown εργαλείων)
    postsData.js            # κατηγορίες + λίστα άρθρων (φτιάχνεται μόνη της από το src/posts/)
    races.js                # οι αγώνες του χάρτη
  posts/                    # τα άρθρα: post-x.md (EL) και post-x-en.md (EN)
    posts.11tydata.js       # κοινές ρυθμίσεις άρθρων (layout, URL, γλώσσα)
  *.njk                     # οι υπόλοιπες σελίδες, μία ανά αρχείο (EL & -en για EN)
  404.njk                   # branded σελίδα σφάλματος (αυτόνομη, χωρίς base.njk)
  sitemap.njk               # → sitemap.xml, από όλες τις σελίδες χωρίς «noindex: true»
  _redirects.njk            # → _redirects για το Cloudflare (/ και παλιοί σύνδεσμοι χωρίς .html)
  kairos-rythmos(-en).njk   # το εργαλείο «Ρυθμός & Καιρός»
css/style.css               # στυλ
css/fonts.css               # @font-face για τα fonts του site (αρχεία στο /fonts κατά το build)
js/main.js                  # κοινό JavaScript
js/passkey.js, js/password.js  # σύνδεση με passkey / κωδικό
js/weather-model.js         # ο υπολογισμός ζέστης/ρυθμού, κοινός για εργαλείο και αρχική
js/weather-pace.js          # λογική του «Ρυθμός & Καιρός» (Open-Meteo, αναζήτηση, πλέγμα)
js/home.js                  # αρχική: κάρτα καιρού και σειρά αγώνων
images/                     # logo, favicon, εικόνες (originals στο images/_originals/)
SETUP-LIKES.md              # οδηγίες Supabase (μέτρημα like)
SETUP-ANALYTICS.md          # οδηγίες GoatCounter
```
Κάθε σελίδα (`.njk`) έχει ένα μικρό front matter (τίτλος, περιγραφή, γλώσσα) και μετά το δικό της περιεχόμενο. Με `noindex: true` μια σελίδα μένει εκτός sitemap και αναζήτησης (λογαριασμός, σύνδεση κ.λπ.)· με `nosearch: true` μόνο εκτός αναζήτησης (η λίστα του blog) — ό,τι ήταν πριν μέσα στο `<main>` παραμένει ακριβώς το ίδιο, απλά το header/footer/menu τα παίρνει έτοιμα από το layout.

## Τοπική προεπισκόπηση
Χρειάζεται **Node 24** ή νεότερο.
```bash
npm install     # μία φορά
npm run start   # Eleventy dev server με live reload
```
Άνοιξε: http://localhost:8080/

Ο dev server του Eleventy δεν εφαρμόζει τα headers του `_headers`. Για δοκιμή όπως στο Cloudflare (CSP, redirects): `npm run cf:dev` → http://localhost:8787/

## Τεστ
```bash
npm run build   # το τεστ του CSP διαβάζει τις έτοιμες σελίδες στο _site
npm test        # node --test tests/*.test.js
```
Τα τεστ (`tests/`, με το ενσωματωμένο `node:test`, χωρίς εξαρτήσεις):
- `weather-model.test.js`: ο υπολογισμός ζέστης/επιβράδυνσης του «Ρυθμός & Καιρός».
- `race-dates.test.js`: σειρά αγώνων, αντίστροφη μέτρηση, αγώνες που πέρασαν ή δεν έχουν ημερομηνία.
- `race-utils.test.js`: οι σελίδες αγώνων: αποστάσεις για τον ρυθμό, ώρα εκκίνησης σε UTC (και με αλλαγή ώρας), αρχεία `.ics`.
- `race-calendar.test.js`: το ημερολόγιο της σελίδας «Αγώνες»: μέρες του μήνα (Δευτέρα–Κυριακή), αγώνες σε κάθε μέρα, αγώνες χωρίς ανακοινωμένη ημερομηνία.
- `races-data.test.js`: τα στοιχεία κάθε αγώνα στο `races.js` (μοναδικό id, πεδία και στις δύο γλώσσες, ημερομηνία στον σωστό μήνα).
- `csp.test.js`: σε κάθε σελίδα του `_site`, το `<meta>` CSP πρώτο στο `<head>`, σωστό hash για κάθε inline script, κανένα `onclick`/`javascript:`.

Στο GitHub Actions τρέχουν μετά το build σε κάθε PR και πριν από κάθε deploy: αν αποτύχει ένα τεστ, το PR βγαίνει κόκκινο και το `main` δεν ανεβαίνει.

## Ρυθμός & Καιρός (Open-Meteo)
- Ο browser καλεί απευθείας δύο endpoints του Open-Meteo: `geocoding-api.open-meteo.com/v1/search` (αναζήτηση πόλης, ελληνικά και αγγλικά μαζί) και `api.open-meteo.com/v1/forecast` (ωριαία πρόγνωση 7 ημερών). Δεν υπάρχει κλειδί ή secret, και ο δικός μας server δεν μεσολαβεί.
- Και τα δύο domains είναι στο `connect-src` του CSP (`_headers`). Το `geolocation=(self)` στο `Permissions-Policy` επιτρέπει το κουμπί «Χρησιμοποίησε τη θέση μου». Οι συντεταγμένες στρογγυλεύονται στο ~1 χλμ. πριν σταλούν.
- Ο υπολογισμός: θερμοκρασία + σημείο δρόσου σε °F, από 0% (≤100) έως ~10% (180). Οι κλίμακες είναι στον πίνακα `BANDS` του `js/weather-model.js` (τον χρησιμοποιούν και το εργαλείο και η κάρτα της αρχικής).
- Ρυθμός και πόλη μένουν στο localStorage (`weatherPace`)· το κουμπί «Καθαρισμός» τα σβήνει. Το `kairos-rythmos.html?pace=5:20` ανοίγει με έτοιμο ρυθμό.
- Το δωρεάν πρόγραμμα του Open-Meteo είναι για **μη εμπορική χρήση**, και η άδεια των δεδομένων (CC BY 4.0) ζητά αναφορά: η γραμμή «Δεδομένα καιρού: Open-Meteo.com» στη σελίδα πρέπει να μείνει.

## Deployment
Το build γίνεται στο GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)): σε κάθε push στο `main` τρέχει `npm ci` + `npx eleventy` και ο φάκελος `_site/` ανεβαίνει
στο **Cloudflare Workers** (static assets) με `npx wrangler deploy` — ρυθμίσεις στο [wrangler.jsonc](wrangler.jsonc). Τα URLs μένουν ακριβώς όπως είναι (`post-x.html`)· η 404 είναι η branded σελίδα.

Σε κάθε pull request γίνεται build (έλεγχος) και ανεβαίνει προεπισκόπηση στο `pr-<αριθμός>-dese-kordonia.<subdomain>.workers.dev`.

Για το Cloudflare χρειάζονται τα secrets `CLOUDFLARE_API_TOKEN` και `CLOUDFLARE_ACCOUNT_ID` στο GitHub (Settings → Secrets and variables → Actions)· χωρίς αυτά τα βήματα του Cloudflare παραλείπονται.

- **`_headers`**: security headers (CSP, HSTS, X-Frame-Options κ.λπ.) και cache. Αν προστεθεί νέα εξωτερική υπηρεσία (script, API, εικόνες), πρέπει να μπει και στο `Content-Security-Policy`, αλλιώς ο browser θα τη μπλοκάρει. Τα inline scripts επιτρέπονται μόνο με hash: το `.eleventy.js` (`cspScriptHashes`) βάζει σε κάθε σελίδα ένα `<meta>` CSP με το hash κάθε script, οπότε **όχι** `onclick="…"` ή `javascript:`. Όλη η πολιτική και οι κανόνες: [docs/adr/0002](docs/adr/0002-politiki-asfaleias-headers-csp.md).
- **`src/_redirects.njk`** → `_redirects`: το `/` σερβίρει το `index.html`, και οι παλιοί σύνδεσμοι χωρίς `.html` πηγαίνουν (301) στη σωστή διεύθυνση.
- Τοπική δοκιμή όπως στο Cloudflare (με headers και redirects): `npm run cf:dev` → http://localhost:8787/

Ο φάκελος `_site/` δεν μπαίνει ποτέ στο git (build artifact).

> Σημείωση: τα CSS/JS φορτώνονται με `?v=<hash του περιεχομένου>` (φίλτρο `assetHash` στο `.eleventy.js`): όταν αλλάζεις `style.css` ή `main.js`, η παράμετρος αλλάζει μόνη της στο επόμενο build και οι browsers κατεβάζουν τη νέα έκδοση — δεν χρειάζεται να ανεβάσεις κάποιον αριθμό.
