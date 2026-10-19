# Δέσε Κορδόνια 🏃

Προσωπική ιστοσελίδα για το τρέξιμο — έμπνευση, πρακτικές συμβουλές, εργαλεία και η προσωπική μου διαδρομή, από το πρώτο χιλιόμετρο μέχρι τον μαραθώνιο.

🔗 **Live:** https://desekordonia.com/

---

## Σελίδες
- **Αρχική** — καλωσόρισμα, η ιστορία μου, προτεινόμενο άρθρο και γρήγορες συμβουλές
- **Ευεξία & Οφέλη** — πώς το τρέξιμο δυναμώνει σώμα και μυαλό
- **Blog** — άρθρα σε 4 κατηγορίες: Πρωταθλητές, Επιστήμη, Ιστορίες & Ψυχολογία, Πρακτικές
  - **Η Επιστήμη του Τρεξίματος** — συγκεντρωτική σελίδα με όλα τα επιστημονικά άρθρα (VO₂max, κατώφλι γαλακτικού, ζώνες παλμών, easy τρέξιμο, cadence)
- **Αγώνες** — διαδραστικός χάρτης με γνωστούς αγώνες δρόμου στην Ελλάδα
- **Εργαλεία**
  - Πρόγραμμα 5K (8 εβδομάδες)
  - Υπολογιστής Ρυθμού (pace + προβλέψεις χρόνων)
  - Ζώνες Καρδιακών Παλμών
  - Πρόβλεψη Χρόνου Αγώνα (5K / 10K / ημιμαραθώνιος / μαραθώνιος, με τον τύπο Riegel)
- **Αποθηκευμένα** — τα άρθρα που έχει σώσει ο επισκέπτης
- **Σχετικά** — ποια είμαι και γιατί ξεκίνησα το site
- **Λογαριασμός** — σύνδεση χωρίς κωδικό (magic link), προφίλ (όνομα, bio) και εγγραφή στο newsletter

Όλες οι σελίδες είναι **δίγλωσσες** (Ελληνικά / Αγγλικά).

## Χαρακτηριστικά
- **Δίγλωσσο** (EL/EN) με εναλλαγή γλώσσας
- **Dark / Light** θέμα (με μνήμη επιλογής)
- **Σύνδεση χωρίς κωδικό** (magic link) + **εγγραφή στο newsletter**, με σελίδες επιβεβαίωσης (verify) και απεγγραφής (unsubscribe)
- **Προφίλ χρήστη** — όνομα & λίγα λόγια, αποθηκευμένα στον λογαριασμό
- **Like ανά άρθρο** (διατύπωση ανά κατηγορία) με **κοινό μέτρημα** μέσω Supabase
- **Αποθήκευση άρθρων** + σελίδα «Αποθηκευμένα» με ταξινόμηση
- **Χάρτης αγώνων** (Leaflet): φίλτρα ανά τύπο, χρωματιστά pins, λίστα-κάρτες με «δες στον χάρτη»
- **«Διάβασε επίσης»** σχετικά άρθρα στο τέλος κάθε post
- **Αναζήτηση** σε άρθρα και εργαλεία (Pagefind), ξεχωριστά για ελληνικά και αγγλικά — εικονίδιο στο μενού, `search.html?q=…`
- **Ομαλές μεταβάσεις** ανάμεσα στις σελίδες (View Transitions) και **prefetch** της σελίδας που πας να ανοίξεις (Speculation Rules)
- **Analytics** (GoatCounter, privacy-friendly)
- **SEO**: sitemap.xml (παράγεται αυτόματα, με hreflang), robots.txt, Open Graph, Schema.org, hreflang, custom 404
- **Εικονογραφημένη ταυτότητα** (σταθερός χαρακτήρας-μασκότ σε όλες τις κατηγορίες)
- **Responsive** για κινητό, tablet και υπολογιστή

## Τεχνολογία
Στατική ιστοσελίδα, χτισμένη με **[Eleventy](https://www.11ty.dev/)** (Nunjucks templates):
- **Eleventy** — κοινό layout (`src/_includes/base.njk`) για head/menu/footer, ώστε μια αλλαγή στο μενού ή στο footer να μην χρειάζεται να γίνει σε δεκάδες αρχεία
- **Άρθρα σε Markdown** (`src/posts/*.md`) με κοινό layout (`src/_includes/post.njk`): meta tags, Open Graph, JSON-LD, ημερομηνία/κατηγορία, εικόνα και «Διάβασε επίσης» φτιάχνονται από το front matter — δες [NEO-ARTHRO.md](NEO-ARTHRO.md)
- **HTML5 & CSS** (CSS custom properties, dark/light theme)
- **Fonts από το ίδιο το site** (Inter, Roboto Condensed — `@fontsource`, μόνο Latin + ελληνικά), χωρίς Google Fonts
- **[Pagefind](https://pagefind.app/)** — στατική αναζήτηση· το ευρετήριο φτιάχνεται στο τέλος κάθε build
- **Vanilla JavaScript** (`js/main.js`) — theme, μενού, φίλτρα blog, like/save, σχετικά άρθρα, analytics
- **[Leaflet](https://leafletjs.com/)** — διαδραστικός χάρτης αγώνων (σερβίρεται από το site, `vendor/leaflet-1.9.4/`)
- **[Supabase](https://supabase.com/)** — κοινό μέτρημα στα like (`article_likes`, REST + RPC)
- **Custom backend API** (`api.desekordonia.com`, `localhost:4000` σε dev) — magic-link σύνδεση, προφίλ χρήστη & newsletter (`/api/auth/*`, `/api/profile`, `/api/newsletter/*`)
- **[GoatCounter](https://www.goatcounter.com/)** — στατιστικά επισκεψιμότητας

## Δομή
```
robots.txt, CNAME
favicon.ico, favicon.png    # εικονίδιο site (και στο images/)
package.json, .eleventy.js  # ρύθμιση Eleventy
src/
  _includes/
    base.njk                # το κοινό layout (head, header/nav, footer)
    post.njk                # το layout των άρθρων (πάνω στο base.njk)
    author-box.njk          # πλαίσιο συγγραφέα στο τέλος των άρθρων
    related.njk             # «Διάβασε επίσης» — 3 σχετικά άρθρα
    search-script.njk       # Pagefind UI (κοινό για search / search-en)
  _data/
    nav.js                  # στοιχεία μενού (κύριο + dropdown εργαλείων)
    postsData.js            # κατηγορίες + λίστα άρθρων (φτιάχνεται μόνη της από το src/posts/)
  posts/                    # τα άρθρα: post-x.md (EL) και post-x-en.md (EN)
    posts.11tydata.js       # κοινές ρυθμίσεις άρθρων (layout, URL, γλώσσα)
  *.njk                     # οι υπόλοιπες σελίδες, μία ανά αρχείο (EL & -en για EN)
  404.njk                   # branded σελίδα σφάλματος (αυτόνομη, χωρίς base.njk)
  sitemap.njk               # → sitemap.xml, από όλες τις σελίδες χωρίς «noindex: true»
css/style.css               # στυλ
css/fonts.css               # @font-face για τα fonts του site (αρχεία στο /fonts κατά το build)
js/main.js                  # κοινό JavaScript
images/                     # logo, favicon, εικόνες (originals στο images/_originals/)
SETUP-LIKES.md              # οδηγίες Supabase (μέτρημα like)
SETUP-ANALYTICS.md          # οδηγίες GoatCounter
```
Κάθε σελίδα (`.njk`) έχει ένα μικρό front matter (τίτλος, περιγραφή, γλώσσα) και μετά το δικό της περιεχόμενο. Με `noindex: true` μια σελίδα μένει εκτός sitemap και αναζήτησης (λογαριασμός, σύνδεση κ.λπ.)· με `nosearch: true` μόνο εκτός αναζήτησης (η λίστα του blog) — ό,τι ήταν πριν μέσα στο `<main>` παραμένει ακριβώς το ίδιο, απλά το header/footer/menu τα παίρνει έτοιμα από το layout.

## Τοπική προεπισκόπηση
```bash
npm install     # μία φορά
npm run start   # Eleventy dev server με live reload
```
Άνοιξε: http://localhost:8080/

## Deployment
Το build γίνεται στο GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)): σε κάθε push στο `main` τρέχει `npm ci` + `npx eleventy` και ο φάκελος `_site/` ανεβαίνει:
- στο **Cloudflare Workers** (static assets) με `npx wrangler deploy` — ρυθμίσεις στο [wrangler.jsonc](wrangler.jsonc). Τα URLs μένουν ακριβώς όπως είναι (`post-x.html`)· η 404 είναι η branded σελίδα.
- στο **GitHub Pages**, ως εφεδρεία μέχρι να περάσει οριστικά το domain στο Cloudflare.

Σε κάθε pull request γίνεται build (έλεγχος) και ανεβαίνει προεπισκόπηση στο `pr-<αριθμός>-dese-kordonia.<subdomain>.workers.dev`.

Για το Cloudflare χρειάζονται τα secrets `CLOUDFLARE_API_TOKEN` και `CLOUDFLARE_ACCOUNT_ID` στο GitHub (Settings → Secrets and variables → Actions)· χωρίς αυτά τα βήματα του Cloudflare παραλείπονται.

- **`_headers`**: security headers (CSP, HSTS, X-Frame-Options κ.λπ.) και cache. Αν προστεθεί νέα εξωτερική υπηρεσία (script, API, εικόνες), πρέπει να μπει και στο `Content-Security-Policy`, αλλιώς ο browser θα τη μπλοκάρει.
- **`src/_redirects.njk`** → `_redirects`: το `/` σερβίρει το `index.html`, και οι παλιοί σύνδεσμοι χωρίς `.html` πηγαίνουν (301) στη σωστή διεύθυνση.
- Τοπική δοκιμή όπως στο Cloudflare (με headers και redirects): `npm run cf:dev` → http://localhost:8787/

Ο φάκελος `_site/` δεν μπαίνει ποτέ στο git (build artifact).

> Σημείωση: τα CSS/JS φορτώνονται με `?v=<hash του περιεχομένου>` (φίλτρο `assetHash` στο `.eleventy.js`): όταν αλλάζεις `style.css` ή `main.js`, η παράμετρος αλλάζει μόνη της στο επόμενο build και οι browsers κατεβάζουν τη νέα έκδοση — δεν χρειάζεται να ανεβάσεις κάποιον αριθμό.
