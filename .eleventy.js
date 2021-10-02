/* eslint-env node */
const slugify = require('@sindresorhus/slugify');
const htmlmin = require('html-minifier');
const format = require('date-fns/format');

module.exports = function (config) {
    config.setQuietMode(true);

    config.addPassthroughCopy('views/static');
    config.addPassthroughCopy('views/manifest.json');
    config.addPassthroughCopy('views/robots.txt');
    config.addPassthroughCopy('views/app.yaml');
    config.addPassthroughCopy('views/favicon.ico');

    // add `date` filter
    config.addFilter('date', function (date, dateFormat) {
        return format(date, dateFormat);
    });

    // add 'slugify' filter as is used in eleventy 1.0.0+
    config.addFilter('slugify', function (str) {
        return slugify('' + str, {
            decamelize: false,
            customReplacements: [["'", '']],
        });
    });

    // Minify Html on prod
    config.addTransform('htmlmin', function (content, outputPath) {
        if (outputPath && outputPath.endsWith('.html')) {
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
            input: 'views',
            output: 'www',
        },
    };
};
