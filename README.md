# Δέσε Κορδόνια 🏃

Προσωπική ιστοσελίδα για το τρέξιμο — έμπνευση, πρακτικές συμβουλές, εργαλεία και η προσωπική μου διαδρομή, από το πρώτο χιλιόμετρο μέχρι τον μαραθώνιο.

🔗 **Live:** https://desekordonia.com/

---

## Σελίδες
- **Αρχική** — καλωσόρισμα, η ιστορία μου, προτεινόμενο άρθρο και γρήγορες συμβουλές
- **Ευεξία & Οφέλη** — πώς το τρέξιμο δυναμώνει σώμα και μυαλό
- **Blog** — άρθρα σε 4 κατηγορίες: Πρωταθλητές, Επιστήμη, Ιστορίες & Ψυχολογία, Πρακτικές συμβουλές
- **Αγώνες** — διαδραστικός χάρτης με γνωστούς αγώνες δρόμου στην Ελλάδα
- **Εργαλεία**
  - Πρόγραμμα 5K (8 εβδομάδες)
  - Υπολογιστής Ρυθμού (pace + προβλέψεις χρόνων)
  - Ζώνες Καρδιακών Παλμών
- **Αποθηκευμένα** — τα άρθρα που έχει σώσει ο επισκέπτης
- **Επικοινωνία** — Instagram

Όλες οι σελίδες είναι **δίγλωσσες** (Ελληνικά / Αγγλικά).

## Χαρακτηριστικά
- **Δίγλωσσο** (EL/EN) με εναλλαγή γλώσσας
- **Dark / Light** θέμα (με μνήμη επιλογής)
- **Like ανά άρθρο** (διατύπωση ανά κατηγορία) με **κοινό μέτρημα** μέσω Supabase
- **Αποθήκευση άρθρων** + σελίδα «Αποθηκευμένα» με ταξινόμηση
- **Χάρτης αγώνων** (Leaflet): φίλτρα ανά τύπο, χρωματιστά pins, λίστα-κάρτες με «δες στον χάρτη»
- **«Διάβασε επίσης»** σχετικά άρθρα στο τέλος κάθε post
- **Analytics** (GoatCounter, privacy-friendly)
- **SEO**: sitemap.xml, robots.txt, Open Graph, Schema.org, hreflang, custom 404
- **Εικονογραφημένη ταυτότητα** (σταθερός χαρακτήρας-μασκότ σε όλες τις κατηγορίες)
- **Responsive** για κινητό, tablet και υπολογιστή

## Τεχνολογία
Στατική ιστοσελίδα, χτισμένη με **[Eleventy](https://www.11ty.dev/)** (Nunjucks templates):
- **Eleventy** — κοινό layout (`src/_includes/base.njk`) για head/menu/footer, ώστε μια αλλαγή στο μενού ή στο footer να μην χρειάζεται να γίνει σε δεκάδες αρχεία
- **HTML5 & CSS** (CSS custom properties, dark/light theme)
- **Vanilla JavaScript** (`js/main.js`) — theme, μενού, φίλτρα blog, like/save, σχετικά άρθρα, analytics
- **[Leaflet](https://leafletjs.com/)** — διαδραστικός χάρτης αγώνων
- **[Supabase](https://supabase.com/)** — κοινό μέτρημα στα like (REST + RPC) + magic-link σύνδεση
- **[GoatCounter](https://www.goatcounter.com/)** — στατιστικά επισκεψιμότητας

## Δομή
```
404.html                    # branded σελίδα σφάλματος (μένει εκτός Eleventy)
robots.txt, sitemap.xml, CNAME
package.json, .eleventy.js  # ρύθμιση Eleventy
src/
  _includes/base.njk        # το κοινό layout (head, header/nav, footer)
  _data/nav.js, site.js     # στοιχεία μενού + εκδόσεις css/js (?v=)
  *.njk                     # μία σελίδα ανά αρχείο (EL & -en για EN), ίδια δομή με πριν
css/style.css               # στυλ
js/main.js                  # κοινό JavaScript
images/                     # logo, favicon, εικόνες (originals στο images/_originals/)
SETUP-LIKES.md              # οδηγίες Supabase (μέτρημα like)
SETUP-ANALYTICS.md          # οδηγίες GoatCounter
```
Κάθε σελίδα (`.njk`) έχει ένα μικρό front matter (τίτλος, περιγραφή, γλώσσα) και μετά το δικό της περιεχόμενο — ό,τι ήταν πριν μέσα στο `<main>` παραμένει ακριβώς το ίδιο, απλά το header/footer/menu τα παίρνει έτοιμα από το layout.

## Τοπική προεπισκόπηση
```bash
npm install     # μία φορά
npm run start   # Eleventy dev server με live reload
```
Άνοιξε: http://localhost:8080/

## Deployment
Φιλοξενείται στο **GitHub Pages** μέσω GitHub Actions ([.github/workflows/pages.yml](.github/workflows/pages.yml)): σε κάθε push στο `main`, το Action τρέχει `npm ci` + `npx eleventy` και ανεβάζει τον φάκελο `_site/`. Ο φάκελος `_site/` δεν μπαίνει ποτέ στο git (build artifact).

> Σημείωση: τα στατικά αρχεία (CSS/JS) φορτώνονται με `?v=` παράμετρο για cache-busting — άλλαξέ το σε `src/_data/site.js` (`cssVersion`/`jsVersion`) όταν αλλάζεις `style.css` ή `main.js` — ενημερώνεται αυτόματα σε όλες τις σελίδες.
