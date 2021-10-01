/* eslint-env node */
const esbuild = require('esbuild');

const postcss = require('postcss');
const fs = require('fs');
const htmlmin = require("html-minifier");
const format = require('date-fns/format');

const { NODE_ENV } = process.env;

module.exports = function (config) {
    config.setQuietMode(true);

    config.addPassthroughCopy('views/static');
    config.addPassthroughCopy('views/manifest.json');
    config.addPassthroughCopy('views/robots.txt');
    config.addPassthroughCopy('views/app.yaml');
    config.addPassthroughCopy('views/favicon.ico');

    // add `date` filter
    config.addFilter('date', function (date, dateFormat) {
        return format(date, dateFormat)
    })

    // Minify Html on prod
    config.addTransform("htmlmin", function(content, outputPath) {
        if(NODE_ENV === 'production' && outputPath && outputPath.endsWith(".html") ) {
          let minified = htmlmin.minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true
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
