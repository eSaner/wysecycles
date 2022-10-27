// Plugins
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const pluginRev = require("eleventy-plugin-rev");
const eleventySass = require("eleventy-sass");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const Image = require("@11ty/eleventy-img");

// Image shortcode
async function imageShortcode(src, alt, classes, sizes) {
    let metadata = await Image('./src/assets/images/' + src, {
        outputDir: './dist/assets/images/optimized/',
        urlPath: '/assets/images/optimized/',
        widths: [414, 768, 910, 1400],
        formats: ["avif", "jpeg"]
    });

    // Default image sizes
    // No sidebar, main - sidebar - gap
    let imageSizes = sizes ?? "(max-width: 959px) 90vw, calc(90vw - 25vw - 80px)";

    // Alter sizes for floated images
    if (classes === 'align-right' || classes === 'align-left') {
        imageSizes = "(max-width: 699px) 90vw, ((min-width: 700px) and (max-width: 960px)) calc((90vw - 16px) * 0.5), calc((90vw - 25vw - 80px - 16px) * 0.5)";
    }

    let imageAttributes = {
        alt,
        class: classes,
        sizes: imageSizes,
        loading: "lazy",
        decoding: "async",
    };

    // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
    return Image.generateHTML(metadata, imageAttributes, {
        whitespaceMode: "inline"
    });
  }

// Config
module.exports = function(eleventyConfig) {

    // Plugins
    eleventyConfig.addPlugin(EleventyRenderPlugin);
    eleventyConfig.addPlugin(pluginRev);
    eleventyConfig.addPlugin(eleventySass, {
        rev: true,
        postcss: postcss([autoprefixer])
    });
    eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

    // Assets
    eleventyConfig.addPassthroughCopy("src/assets/fonts");
    eleventyConfig.addPassthroughCopy("src/assets/images");
    eleventyConfig.addPassthroughCopy("src/assets/icons");
    eleventyConfig.addPassthroughCopy("src/assets/scripts");

    // Settings
    return {
        markdownTemplateEngine: "njk",
        dir: {
            input: "src",
            includes: "layouts",
            output: "dist"
        }
    }
};
