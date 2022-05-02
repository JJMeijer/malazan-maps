/* eslint-env node */
const htmlmin = require("html-minifier");
const format = require("date-fns/format");

module.exports = function (config) {
    config.setQuietMode(true);

    config.addPassthroughCopy("views/static");
    config.addPassthroughCopy("views/app.yaml");
    config.addPassthroughCopy("views/favicon.ico");
    config.addPassthroughCopy("views/manifest.json");
    config.addPassthroughCopy("views/robots.txt");
    config.addPassthroughCopy("views/service-worker.js");

    config.setUseGitIgnore(false);

    // add `date` filter for sitemap
    config.addFilter("date", function (date, dateFormat) {
        return format(date, dateFormat);
    });

    // Add `env` filter to use Environment variables
    config.addFilter("env", (key) => process.env[key]);

    /**
     * Add `bust` filter for cachebusting. Very simple setup as it assumes no query param is already present
     */
    config.addFilter("bust", (url) => {
        return `${url}?v=${new Date().getTime()}`;
    });

    config.addFilter("currentYear", () => {
        return new Date().getFullYear();
    });

    // Minify Html on prod
    config.addTransform("htmlmin", function (content, outputPath) {
        if (outputPath && outputPath.endsWith(".html")) {
            let minified = htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
            });
            return minified;
        }

        return content;
    });

    // Set Directories
    return {
        dir: {
            input: "views",
            output: "www",
        },
    };
};
