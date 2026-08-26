/* ===== Δέσε Κορδόνια — παραγωγή OG images (κάρτες κοινοποίησης) =====

   Φτιάχνει μία μοναδική εικόνα 1200×630 ανά άρθρο και ανά γλώσσα, στα χρώματα
   του site, με τον τίτλο και την κατηγορία του άρθρου. Είναι η εικόνα που
   βλέπει κάποιος όταν του στέλνεις τον σύνδεσμο σε Facebook, WhatsApp, X κ.λπ.

   Τρέχει αυτόματα στο τέλος κάθε build (δες .eleventy.js) ή χειροκίνητα με
   `npm run og`. Οι κάρτες γράφονται στο _site/images/og/ και ΔΕΝ μπαίνουν στο
   git — παράγονται από την αρχή σε κάθε deploy.

   Τα δεδομένα (τίτλος, κατηγορία) έρχονται από το src/_data/postsData.js, οπότε
   ένα νέο άρθρο αποκτά κάρτα χωρίς καμία επιπλέον ενέργεια. */

const fs = require("fs");
const path = require("path");
const satori = require("satori").default || require("satori");
const { Resvg } = require("@resvg/resvg-js");
const postsData = require("../src/_data/postsData.js");

/* Αύξησε το όταν αλλάξει ο σχεδιασμός της κάρτας, ώστε να ξαναφτιαχτούν όλες. */
const TEMPLATE_VERSION = 3;

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "_site", "images", "og");
const MANIFEST = path.join(OUT_DIR, ".manifest.json");

const C = {
  bg: "#0f1115",
  surface: "#181b22",
  accent: "#ff5722",
  accent2: "#ffa000",
  text: "#f2f3f5",
  dim: "#aab0bb",
};

/* Ίδιες γραμματοσειρές με το site: Roboto Condensed στους τίτλους, Inter στο κείμενο. */
const fonts = [
  { name: "Roboto Condensed", weight: 600, style: "normal", data: fs.readFileSync(path.join(ROOT, "build/fonts/RobotoCondensed-600.ttf")) },
  { name: "Roboto Condensed", weight: 700, style: "normal", data: fs.readFileSync(path.join(ROOT, "build/fonts/RobotoCondensed-700.ttf")) },
  { name: "Inter", weight: 400, style: "normal", data: fs.readFileSync(path.join(ROOT, "build/fonts/Inter-400.ttf")) },
];

const logoDataUri =
  "data:image/png;base64," + fs.readFileSync(path.join(ROOT, "images/logo.png")).toString("base64");

/* Ελληνικά κεφαλαία: ο τόνος φεύγει («Επιστήμη» -> «ΕΠΙΣΤΗΜΗ»), τα διαλυτικά μένουν.
   Ο browser το κάνει μόνος του με text-transform σε lang="el", το satori όχι — οπότε
   μετατρέπουμε εμείς το κείμενο πριν του το δώσουμε. */
function upper(s) {
  return s.toUpperCase().normalize("NFD").replace(/[̀́͂̈́]/g, "").normalize("NFC");
}

/* Μικροί βοηθοί για να γράφονται τα στοιχεία της κάρτας πιο ευανάγνωστα. */
const el = (type, style, children) => ({ type, props: { style, children } });
const img = (style, src) => ({ type: "img", props: { style, src } });

/* Μεγάλοι τίτλοι χρειάζονται μικρότερα γράμματα για να χωρέσουν σε 3–4 σειρές. */
function titleSize(title) {
  const n = title.length;
  if (n <= 42) return 78;
  if (n <= 60) return 70;
  if (n <= 85) return 60;
  return 52;
}

function card({ title, category }) {
  return el("div", {
    display: "flex", flexDirection: "column", width: "1200px", height: "630px",
    backgroundColor: C.bg, color: C.text, fontFamily: "Roboto Condensed", position: "relative",
  }, [
    /* Πορτοκαλί λωρίδα στο αριστερό άκρο — το σήμα κατατεθέν του site */
    el("div", {
      position: "absolute", left: 0, top: 0, width: "14px", height: "630px",
      backgroundImage: `linear-gradient(180deg, ${C.accent} 0%, ${C.accent2} 100%)`,
    }),
    /* Απαλή λάμψη πάνω δεξιά, για να μη μοιάζει επίπεδο σκέτο ορθογώνιο */
    el("div", {
      position: "absolute", right: "-200px", top: "-210px", width: "620px", height: "620px",
      borderRadius: "310px", backgroundColor: C.accent, opacity: 0.11,
    }),
    el("div", {
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      width: "1200px", height: "630px", padding: "62px 76px 58px 82px",
    }, [
      /* Κεφαλίδα: λογότυπο + λεκτικό σήμα */
      el("div", { display: "flex", alignItems: "center" }, [
        img({ width: "62px", height: "58px", marginRight: "20px" }, logoDataUri),
        el("div", { display: "flex", fontSize: "34px", fontWeight: 700, letterSpacing: "1.5px" }, [
          el("span", {}, upper("Δέσε")),
          el("span", { color: C.accent }, "."),
          el("span", {}, upper("Κορδόνια")),
        ]),
      ]),
      /* Σώμα: κατηγορία και τίτλος */
      el("div", { display: "flex", flexDirection: "column" }, [
        el("div", {
          display: "flex", fontSize: "23px", fontWeight: 700, color: C.accent,
          letterSpacing: "3.5px", marginBottom: "22px",
        }, upper(category)),
        el("div", {
          display: "flex", fontSize: `${titleSize(title)}px`, fontWeight: 700,
          lineHeight: 1.17, letterSpacing: "-0.4px", color: "#ffffff",
        }, title),
      ]),
      /* Υποσέλιδο */
      el("div", { display: "flex", alignItems: "center" }, [
        el("div", { width: "46px", height: "3px", backgroundColor: C.accent, marginRight: "18px" }),
        el("div", { display: "flex", fontFamily: "Inter", fontSize: "24px", color: C.dim, letterSpacing: "0.4px" }, "desekordonia.com"),
      ]),
    ]),
  ]);
}

async function render(spec, outFile) {
  const svg = await satori(card(spec), { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  fs.writeFileSync(outFile, png);
  return png.length;
}

/* Όλες οι κάρτες που πρέπει να υπάρχουν: κάθε άρθρο × 2 γλώσσες. */
function allCards() {
  const list = [];
  for (const p of postsData.posts) {
    for (const lang of ["el", "en"]) {
      list.push({
        file: p.slug + (lang === "en" ? "-en" : "") + ".png",
        title: p.feed[lang].title,
        category: postsData.cats[p.cat][lang],
      });
    }
  }
  return list;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let manifest = {};
  try { manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8")); } catch (e) { /* πρώτη φορά */ }

  const next = {};
  let made = 0, kept = 0, bytes = 0;

  for (const c of allCards()) {
    const key = JSON.stringify([TEMPLATE_VERSION, c.title, c.category]);
    next[c.file] = key;
    const target = path.join(OUT_DIR, c.file);
    if (manifest[c.file] === key && fs.existsSync(target)) { kept++; continue; }
    bytes += await render(c, target);
    made++;
  }

  /* Καθάρισμα καρτών από άρθρα που δεν υπάρχουν πια */
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (f.endsWith(".png") && !next[f]) fs.unlinkSync(path.join(OUT_DIR, f));
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(next, null, 2));
  const avg = made ? ` (~${Math.round(bytes / made / 1024)}KB η καθεμία)` : "";
  console.log(`[og] ${made} νέες κάρτες, ${kept} αμετάβλητες${avg}`);
}

module.exports = main;

if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
