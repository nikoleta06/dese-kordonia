/* Κοινά δεδομένα για όλα τα άρθρα του φακέλου src/posts/.
   Από το όνομα του αρχείου βγαίνουν μόνα τους το URL και η γλώσσα:
     post-vo2max.md    → post-vo2max.html     (ελληνικά)
     post-vo2max-en.md → post-vo2max-en.html  (αγγλικά) */
module.exports = {
  layout: "post.njk",
  activeNav: "blog",
  eleventyComputed: {
    permalink: (data) => `${data.page.fileSlug}.html`,
    lang: (data) => (data.page.fileSlug.endsWith("-en") ? "en" : "el"),
    // το κοινό όνομα των δύο γλωσσών, π.χ. "post-vo2max"
    slug: (data) => data.page.fileSlug.replace(/-en$/, ""),
  },
};
