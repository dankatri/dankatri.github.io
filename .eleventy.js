const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItFootnote = require("markdown-it-footnote");

module.exports = function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);

  // Copy static assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("favicon.ico");

  // Configure Markdown
  let markdownLibrary = markdownIt({
    html: true,
    breaks: false,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: false
  }).use(markdownItFootnote);
  
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Ignore old Jekyll files
  eleventyConfig.ignores.add("_layouts_jekyll/**");
  eleventyConfig.ignores.add("_includes_jekyll/**");
  eleventyConfig.ignores.add("Gemfile");
  eleventyConfig.ignores.add("Gemfile.lock");
  eleventyConfig.ignores.add("beautiful-jekyll-theme.gemspec");
  eleventyConfig.ignores.add("_config.yml");
  eleventyConfig.ignores.add("vendor/**");
  eleventyConfig.ignores.add(".bundle/**");

  // Date formatting filter
  eleventyConfig.addFilter("dateFormat", function(date, format) {
    const d = new Date(date);
    const months = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];
    const month = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  });

  // Excerpt filter
  eleventyConfig.addFilter("excerpt", function(content, length = 50) {
    const text = content.replace(/<[^>]+>/g, '');
    const words = text.split(/\s+/);
    if (words.length <= length) return text;
    return words.slice(0, length).join(' ') + '...';
  });

  // Strip HTML filter
  // Note: This filter is designed to work with trusted markdown content from the repository.
  // Output should always be further escaped with xml_escape when used in feeds.
  eleventyConfig.addFilter("strip_html", function(content) {
    if (!content) return '';
    // Remove all HTML tags including script tags
    // This is safe for trusted content and will be XML-escaped in feed context
    let sanitized = String(content).replace(/<[^>]*>/g, '');
    return sanitized;
  });

  // XML escape filter
  // This provides defense-in-depth by escaping any remaining special characters
  eleventyConfig.addFilter("xml_escape", function(content) {
    if (!content) return '';
    return String(content)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  });

  // Absolute URL filter
  eleventyConfig.addFilter("absolute_url", function(url) {
    return url;
  });

  // Relative URL filter
  eleventyConfig.addFilter("relative_url", function(url) {
    return url;
  });

  // Get year from date
  eleventyConfig.addFilter("year", function(date) {
    return new Date(date).getFullYear();
  });

  // Count words
  eleventyConfig.addFilter("number_of_words", function(content) {
    return content.split(/\s+/).length;
  });

  // Truncate words
  eleventyConfig.addFilter("truncatewords", function(content, length = 50) {
    const words = content.split(/\s+/);
    if (words.length <= length) return content;
    return words.slice(0, length).join(' ');
  });

  // RSS date filter
  eleventyConfig.addFilter("rssDate", function(date) {
    if (!date) return "";
    try {
      const d = new Date(date);
      return d.toUTCString();
    } catch (e) {
      console.error("Error formatting RSS date:", e);
      return "";
    }
  });

  // Limit filter
  eleventyConfig.addFilter("limit", function(array, limit) {
    return array.slice(0, limit);
  });

  // Reverse filter
  eleventyConfig.addFilter("reverse", function(array) {
    return [...array].reverse();
  });

  // Collections
  eleventyConfig.addCollection("posts", function(collectionApi) {
    const now = new Date();
    return collectionApi.getFilteredByGlob("_posts/*.md")
      .filter(post => {
        const postDate = new Date(post.date);
        return postDate <= now;
      })
      .reverse();
  });

  // Tags collection
  eleventyConfig.addCollection("tagList", function(collection) {
    let tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      layouts: "_layouts",
      output: "_site"
    },
    templateFormats: ["html", "md", "njk", "xml"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
