/* Κατηγορίες και λίστα άρθρων του blog.

   Τα άρθρα γράφονται στο src/posts/ (ένα .md ανά γλώσσα: post-x.md και post-x-en.md).
   Η λίστα «posts» παρακάτω ΔΕΝ γράφεται με το χέρι: φτιάχνεται σε κάθε build από το
   front matter των άρθρων, και τροφοδοτεί το «Διάβασε επίσης» (related.njk), τα RSS
   feeds (feed.njk / feed-en.njk) και τις κάρτες κοινοποίησης (scripts/generate-og.js).

   Κάθε κατηγορία:
     el/en     — σύντομη ονομασία (κάρτες, RSS, κάρτα κοινοποίησης)
     img       — η εικόνα της κατηγορίας (images/<img>.avif/.webp/.jpg)
     svg       — εικονίδιο
     label     — η ετικέτα στη γραμμή κάτω από τον τίτλο του άρθρου (ένα άρθρο μπορεί
                 να έχει δική του με «label:» στο front matter)
     metaIcon  — αν το εικονίδιο φαίνεται και σε εκείνη τη γραμμή
     page      — σελίδα της κατηγορίας, για σύνδεσμο από την ετικέτα (προαιρετικό) */

const ICO = 'style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.25em"';

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const POSTS_DIR = path.join(__dirname, "..", "posts");
const CAT_ORDER = ["champions", "science", "tips", "stories"];

/* Ένα στοιχείο ανά άρθρο (και για τις δύο γλώσσες), από το front matter των .md.
   Σειρά: πιο πρόσφατο πρώτο· για άρθρα της ίδιας μέρας, με τη σειρά των κατηγοριών
   (CAT_ORDER) και μετά αλφαβητικά. */
function readPosts() {
  const byLang = { el: {}, en: {} };
  for (const file of fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"))) {
    const name = file.slice(0, -3);
    const lang = name.endsWith("-en") ? "en" : "el";
    byLang[lang][lang === "en" ? name.slice(0, -3) : name] = matter.read(path.join(POSTS_DIR, file)).data;
  }
  const posts = Object.keys(byLang.el).map((slug) => {
    const el = byLang.el[slug];
    const en = byLang.en[slug];
    if (!en) throw new Error(`Λείπει η αγγλική εκδοχή: src/posts/${slug}-en.md`);
    const feed = (d) => ({ title: d.feedTitle || d.shareTitle || d.heading, desc: d.feedSummary || d.summary });
    return { slug, cat: el.cat, date: el.published, el: el.cardTitle, en: en.cardTitle, feed: { el: feed(el), en: feed(en) } };
  });
  return posts.sort(
    (a, b) =>
      b.date.localeCompare(a.date) ||
      CAT_ORDER.indexOf(a.cat) - CAT_ORDER.indexOf(b.cat) ||
      a.slug.localeCompare(b.slug)
  );
}

module.exports = {
  cats: {
    champions: {
      el: "Πρωταθλητές", en: "Champions", img: "cat-champions",
      label: { el: "Τι μας διδάσκουν οι πρωταθλητές", en: "Champions" }, metaIcon: true,
      svg: '<svg ' + ICO + ' viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.9 6.26 6.88.56-5.2 4.52 1.56 6.7L12 17.27 5.86 20.54l1.56-6.7-5.2-4.52 6.88-.56z"/></svg>',
    },
    science: {
      el: "Επιστήμη", en: "Science", img: "cat-science",
      label: { el: "Η επιστήμη του τρεξίματος", en: "Science" }, metaIcon: true, page: "epistimi-trexsimatos",
      svg: '<svg ' + ICO + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5a3 3 0 0 0-3 3 2.5 2.5 0 0 0-2 4 2.5 2.5 0 0 0 1.5 4.5A2.5 2.5 0 0 0 12 19V5z"/><path d="M12 5a3 3 0 0 1 3 3 2.5 2.5 0 0 1 2 4 2.5 2.5 0 0 1-1.5 4.5A2.5 2.5 0 0 1 12 19"/></svg>',
    },
    stories: {
      el: "Ιστορίες & Ψυχολογία", en: "Stories & Psychology", img: "cat-stories",
      label: { el: "Προσωπική ιστορία", en: "Stories & Psychology" }, metaIcon: false,
      svg: '<svg ' + ICO + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z"/></svg>',
    },
    tips: {
      el: "Πρακτικές", en: "Practical", img: "cat-tips",
      label: { el: "Πρακτικές συμβουλές", en: "Practical" }, metaIcon: false,
      svg: '<svg ' + ICO + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>',
    },
  },
  posts: readPosts(),
};
