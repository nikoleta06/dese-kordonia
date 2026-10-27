const crypto = require("crypto");
const fs = require("fs");
const { execFileSync } = require("child_process");

const SITE_URL = "https://desekordonia.com";

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon.png");
  eleventyConfig.addPassthroughCopy("googlee4e046c775be8626.html");
  // Cloudflare: HTTP headers (security, cache) — δες το αρχείο _headers
  eleventyConfig.addPassthroughCopy("_headers");

  // Leaflet (χάρτης αγώνων) από το ίδιο το site αντί για unpkg.com: κανένα script από τρίτους
  // χωρίς έλεγχο, και το CSP μένει αυστηρό. Η έκδοση είναι στο όνομα του φακέλου.
  eleventyConfig.addPassthroughCopy({
    "node_modules/leaflet/dist/leaflet.{js,css}": "vendor/leaflet-1.9.4",
    "node_modules/leaflet/dist/images": "vendor/leaflet-1.9.4/images",
  });

  // Fonts (Latin + ελληνικά) από τα πακέτα @fontsource → /fonts, δες css/fonts.css
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource/inter/files/inter-{greek,latin}-{400,500,600}-normal.woff2": "fonts",
    "node_modules/@fontsource/roboto-condensed/files/roboto-condensed-{greek,latin}-{500,600,700}-normal.woff2": "fonts",
  });

  // Cache busting: ?v=<hash του περιεχομένου> αντί για χειροκίνητο cssVersion/jsVersion.
  // Αλλάζει μόνο όταν αλλάξει το αρχείο, οπότε οι browsers κατεβάζουν τη νέα έκδοση
  // ακριβώς τότε — χωρίς να χρειάζεται να θυμάσαι να ανεβάσεις έναν αριθμό.
  const hashCache = new Map();
  eleventyConfig.on("eleventy.before", () => hashCache.clear());
  eleventyConfig.addFilter("assetHash", (file) => {
    if (!hashCache.has(file)) {
      const hash = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 10);
      hashCache.set(file, hash);
    }
    return hashCache.get(file);
  });

  // CSP χωρίς 'unsafe-inline' για τα scripts (δες docs/adr/0002 και _headers).
  // Σε κάθε σελίδα: ένα hash SHA-256 για κάθε inline <script> (και speculation rules) και
  // ένα <meta http-equiv="Content-Security-Policy"> στην αρχή του <head> που επιτρέπει μόνο
  // αυτά. Ο browser εφαρμόζει και την πολιτική του _headers και αυτή, οπότε ένα script πρέπει
  // να περνά και τις δύο: τρέχουν μόνο τα scripts που γράψαμε εμείς. Αλλάζεις ένα script →
  // το hash ξαναϋπολογίζεται μόνο του. Τα JSON-LD δεν εκτελούνται, άρα δεν χρειάζονται hash.
  // Οι πηγές πρέπει να ταιριάζουν με το script-src του _headers (χωρίς το 'unsafe-inline').
  const SCRIPT_SOURCES = "'self' 'wasm-unsafe-eval' https://gc.zgo.at";
  eleventyConfig.addTransform("cspScriptHashes", function (content) {
    const out = this.page.outputPath;
    if (typeof out !== "string" || !out.endsWith(".html") || !content.includes("<head>")) return content;
    const hashes = new Set();
    for (const m of content.matchAll(/<script(?:\s+type="speculationrules")?\s*>([\s\S]*?)<\/script>/g)) {
      // Ο browser διαβάζει τα \r\n (αρχεία Windows) ως \n πριν υπολογίσει το hash· κάνουμε το ίδιο
      const text = m[1].replace(/\r\n?/g, "\n");
      hashes.add("'sha256-" + crypto.createHash("sha256").update(text, "utf8").digest("base64") + "'");
    }
    const policy = ["script-src", SCRIPT_SOURCES, ...hashes].join(" ");
    return content.replace("<head>", () => '<head>\n  <meta http-equiv="Content-Security-Policy" content="' + policy + '">');
  });

  // Sitemap (src/sitemap.njk): όλες οι δημόσιες σελίδες, με την ημερομηνία του τελευταίου
  // commit που τις άλλαξε και τα ζεύγη ελληνικά/αγγλικά (hreflang). Νέα σελίδα = μπαίνει
  // μόνη της· σελίδες με «noindex: true» στο front matter μένουν εκτός.
  const lastmodCache = new Map();
  function gitLastmod(inputPath) {
    if (!lastmodCache.has(inputPath)) {
      let date = "";
      try {
        date = execFileSync("git", ["log", "-1", "--format=%cs", "--", inputPath], { encoding: "utf8" }).trim();
      } catch {
        // Χωρίς git (π.χ. φάκελος από zip): η σημερινή ημερομηνία
      }
      lastmodCache.set(inputPath, date || new Date().toISOString().slice(0, 10));
    }
    return lastmodCache.get(inputPath);
  }

  // Η διεύθυνση μιας σελίδας χωρίς το «/» μπροστά («agones.html», «index.html»). Από το url
  // και όχι από το data.permalink: στις σελίδες με pagination (μία ανά αγώνα) το data.permalink
  // είναι ίδιο για όλες.
  const pagePath = (item) => (typeof item.url === "string" ? item.url.slice(1) || "index.html" : "");
  eleventyConfig.addFilter("pagePath", pagePath);

  eleventyConfig.addFilter("sitemapPages", (items) => {
    const pages = items.filter((item) => !item.data.noindex && pagePath(item).endsWith(".html"));
    const urlOf = (permalink) => SITE_URL + "/" + (permalink === "index.html" ? "" : permalink);
    const exists = new Set(pages.map(pagePath));
    return pages
      .map((item) => {
        const permalink = pagePath(item);
        const base = permalink.replace(/(-en)?\.html$/, "");
        const el = base + ".html";
        const en = base + "-en.html";
        const alternates =
          exists.has(el) && exists.has(en)
            ? [
                { lang: "el", href: urlOf(el) },
                { lang: "en", href: urlOf(en) },
                { lang: "x-default", href: urlOf(el) },
              ]
            : [];
        // Άρθρα: η ημερομηνία «updated» του front matter (η πραγματική τελευταία αλλαγή
        // περιεχομένου)· οι υπόλοιπες σελίδες: το τελευταίο commit που τις άλλαξε.
        const lastmod = item.data.updated || item.data.published || gitLastmod(item.inputPath);
        return { loc: urlOf(permalink), lastmod, alternates };
      })
      .sort((a, b) => a.loc.localeCompare(b.loc));
  });

  eleventyConfig.addFilter("navHref", (file, lang) => {
    return file + (lang === "en" ? "-en" : "") + ".html";
  });

  // Αρχική: πόσα άρθρα έχει μια κατηγορία (για τις κατηγορίες κάτω από τα πρόσφατα άρθρα)
  eleventyConfig.addFilter("countCat", (posts, cat) => posts.filter((p) => p.cat === cat).length);

  // Αρχική: οι αγώνες μιας περιοχής με σειρά επόμενης διοργάνωσης, με τη μέρα του build.
  // Ίδιος κανόνας με το js/race-dates.js, που τους ξαναταξινομεί στον browser ώστε η λίστα
  // να μένει σωστή κι αν περάσει καιρός χωρίς νέο build: ημερομηνία που δεν πέρασε μετρά
  // όπως είναι, ημερομηνία που πέρασε πάει ένα χρόνο μετά, χωρίς ημερομηνία ο μήνας.
  eleventyConfig.addFilter("racesFromNow", (list, region) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const day = (str) => new Date(str + "T00:00");
    const key = (r) => {
      if (r.date) {
        const start = day(r.date);
        if (day(r.dateEnd || r.date) >= today) return start.getTime();
        start.setFullYear(start.getFullYear() + 1);
        return start.getTime();
      }
      const year = r.month >= today.getMonth() + 1 ? today.getFullYear() : today.getFullYear() + 1;
      return new Date(year, r.month - 1, 15).getTime();
    };
    return list.filter((r) => r.region === region).sort((a, b) => key(a) - key(b));
  });

  // Σελίδες αγώνων και αρχεία .ics (src/agonas*.njk, src/race-ics.njk): δες scripts/race-utils.js
  const raceUtils = require("./scripts/race-utils.js");
  eleventyConfig.addFilter("raceKm", raceUtils.distancesKm);
  eleventyConfig.addFilter("raceStartUtc", (race) => {
    const d = raceUtils.startUtc(race);
    return d ? d.toISOString().replace(".000Z", "Z") : "";
  });
  eleventyConfig.addFilter("raceUpcoming", (race) => raceUtils.isUpcoming(race));
  eleventyConfig.addFilter("raceIcs", (race, lang) => raceUtils.raceIcs(race, lang));
  eleventyConfig.addFilter("raceCalendarLinks", (race, lang) => raceUtils.calendarLinks(race, lang));

  // RSS: το πρότυπο απαιτεί ημερομηνίες σε μορφή RFC-822 («Tue, 21 Jul 2026 08:00:00 GMT»),
  // ενώ στο postsData.js τις κρατάμε ως "2026-07-21".
  eleventyConfig.addFilter("rfc822", (isoDate) => {
    return new Date(isoDate + "T08:00:00Z").toUTCString();
  });

  // ===== Άρθρα σε Markdown (src/posts/) =====

  // Ημερομηνία στη γραμμή κάτω από τον τίτλο: «26 Ιουνίου 2026» / «26 June 2026»
  const MONTHS = {
    el: ["Ιανουαρίου", "Φεβρουαρίου", "Μαρτίου", "Απριλίου", "Μαΐου", "Ιουνίου",
         "Ιουλίου", "Αυγούστου", "Σεπτεμβρίου", "Οκτωβρίου", "Νοεμβρίου", "Δεκεμβρίου"],
    en: ["January", "February", "March", "April", "May", "June",
         "July", "August", "September", "October", "November", "December"],
  };
  eleventyConfig.addFilter("articleDate", (iso, lang) => {
    const [y, m, d] = String(iso).split("-").map(Number);
    return `${d} ${MONTHS[lang === "en" ? "en" : "el"][m - 1]} ${y}`;
  });

  // Συντομεύσεις μέσα στα άρθρα, για να μη γράφεται HTML:
  //   {% note %}💡 **Συμβουλή:** κείμενο{% endnote %}   → το πορτοκαλί πλαίσιο
  //   {% sources %}
  //   1. Συγγραφέας (2020). <cite>Τίτλος.</cite> Περιοδικό. <a href="…" target="_blank" rel="noopener">PubMed →</a>
  //   {% endsources %}                                  → το πλαίσιο «Πηγές» στο τέλος
  const md = require("markdown-it")({ html: true });
  const isEn = (page) => page.fileSlug.endsWith("-en");
  eleventyConfig.addPairedShortcode("note", (inner) => `<div class="note">${md.renderInline(inner.trim())}</div>`);
  eleventyConfig.addPairedShortcode("sources", function (inner) {
    const en = isEn(this.page);
    const icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';
    const intro = en ? "The main scientific references behind this article:" : "Οι κύριες επιστημονικές αναφορές πίσω από αυτό το άρθρο:";
    // Μία γραμμή χωρίς κενές γραμμές: αλλιώς το Markdown γύρω του θα έκοβε το HTML
    const list = md.render(inner.trim()).replace(/\n+/g, "");
    return `<div class="sources"><h4>${icon}${en ? "Sources" : "Πηγές"}</h4><p>${intro}</p>${list}</div>`;
  });

  // «Διάβασε επίσης»: 3 σχετικά άρθρα — πρώτα ίδιας κατηγορίας, μετά τα υπόλοιπα
  // (ίδια λογική με τον παλιό JS injector του main.js, τώρα στο build)
  const postsData = require("./src/_data/postsData.js");
  eleventyConfig.addFilter("relatedPosts", (permalink) => {
    const slug = String(permalink).replace("-en.html", "").replace(".html", "");
    const posts = postsData.posts;
    const cur = posts.find((p) => p.slug === slug);
    if (!cur) return [];
    const same = posts.filter((p) => p.slug !== cur.slug && p.cat === cur.cat);
    const others = posts.filter((p) => p.slug !== cur.slug && p.cat !== cur.cat);
    return same.concat(others).slice(0, 3);
  });

  // Μετά το build: OG images (μία κάρτα κοινοποίησης ανά άρθρο) και το ευρετήριο
  // αναζήτησης του Pagefind (_site/pagefind), που χρησιμοποιεί η σελίδα αναζήτησης.
  eleventyConfig.on("eleventy.after", async () => {
    await require("./scripts/generate-og.js")();

    const pagefind = await import("pagefind");
    const { index } = await pagefind.createIndex({});
    const { page_count } = await index.addDirectory({ path: "_site" });
    await index.writeFiles({ outputPath: "_site/pagefind" });
    await pagefind.close();
    console.log(`[pagefind] ${page_count} σελίδες στο ευρετήριο αναζήτησης`);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
