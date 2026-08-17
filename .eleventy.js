const { execSync } = require("child_process");
const path = require("path");

module.exports = function(eleventyConfig) {
  // Compile Sass before each build — output directly to _site to avoid watcher loop
  eleventyConfig.on("eleventy.before", () => {
    try {
      execSync("npx sass _sass/style.scss _site/assets/css/style.css --load-path=_sass --no-source-map", {
        cwd: __dirname,
        stdio: "ignore"
      });
    } catch (e) {
      console.error("Sass compilation error");
    }
  });

  // Watch _sass for changes (triggers rebuild which re-runs sass)
  eleventyConfig.addWatchTarget("_sass/");

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("*.png");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("site.webmanifest");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy(".nojekyll");

  eleventyConfig.setLiquidOptions({
    dynamicPartials: false,
    strictFilters: false
  });

  // Ignore vendor directory
  eleventyConfig.ignores.add("vendor");

  // Layout aliases
  eleventyConfig.addLayoutAlias("home", "home.html");
  eleventyConfig.addLayoutAlias("work", "work.html");
  eleventyConfig.addLayoutAlias("post", "post.html");
  eleventyConfig.addLayoutAlias("default", "default.html");

  // Collections
  eleventyConfig.addCollection("post", function(collectionApi) {
    return collectionApi.getFilteredByGlob("_posts/*.md").sort((a, b) => b.date - a.date);
  });

  // Global Computed Permalinks for Jekyll posts
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      if (data.permalink) return data.permalink;
      if (data.page.filePathStem.startsWith("/_posts/")) {
        const stem = data.page.filePathStem.replace("/_posts/", "");
        const match = stem.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
        if (match) {
          const [, year, month, day, slug] = match;
          const category = data.categories ? data.categories : "";
          if (category) {
            return `/${category.toLowerCase()}/${year}/${month}/${day}/${slug}/index.html`;
          }
          return `/${year}/${month}/${day}/${slug}/index.html`;
        }
      }
      return undefined;
    }
  });

  // Liquid filters & custom tags
  eleventyConfig.addFilter("relative_url", (url) => url || "");
  eleventyConfig.addLiquidTag("seo", function() {
    return {
      render: function() {
        return Promise.resolve("");
      }
    };
  });

  return {
    pathPrefix: "/",
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      output: "_site"
    },
    templateFormats: ["html", "md", "liquid"],
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid"
  };
};
