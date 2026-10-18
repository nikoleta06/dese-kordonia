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
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("googlee4e046c775be8626.html");
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

  eleventyConfig.addFilter("sitemapPages", (items) => {
    const pages = items.filter((item) => !item.data.noindex && String(item.data.permalink || "").endsWith(".html"));
    const urlOf = (permalink) => SITE_URL + "/" + (permalink === "index.html" ? "" : permalink);
    const exists = new Set(pages.map((item) => item.data.permalink));
    return pages
      .map((item) => {
        const permalink = item.data.permalink;
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
        return { loc: urlOf(permalink), lastmod: gitLastmod(item.inputPath), alternates };
      })
      .sort((a, b) => a.loc.localeCompare(b.loc));
  });

  eleventyConfig.addFilter("navHref", (file, lang) => {
    return file + (lang === "en" ? "-en" : "") + ".html";
  });

  // RSS: το πρότυπο απαιτεί ημερομηνίες σε μορφή RFC-822 («Tue, 21 Jul 2026 08:00:00 GMT»),
  // ενώ στο postsData.js τις κρατάμε ως "2026-07-21".
  eleventyConfig.addFilter("rfc822", (isoDate) => {
    return new Date(isoDate + "T08:00:00Z").toUTCString();
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
