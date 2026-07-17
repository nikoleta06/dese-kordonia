module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon.png");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("googlee4e046c775be8626.html");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("404.html");

  eleventyConfig.addFilter("navHref", (file, lang) => {
    return file + (lang === "en" ? "-en" : "") + ".html";
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
