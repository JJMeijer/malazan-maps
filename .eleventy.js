/* eslint-env node */
const esbuild = require('esbuild');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const postcssMinify = require('postcss-minify');
const stylelint = require('stylelint');
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

    config.addWatchTarget('src');

    config.on('beforeBuild', () => {
        // Build JS
        const { errors, warnings } = esbuild.buildSync({
            entryPoints: ['src/ts/search.ts', 'src/ts/map.ts'],
            outdir: 'views/static/js',
            minify: NODE_ENV === 'production',
            sourcemap: NODE_ENV !== 'production',
            target: 'es2015',
            bundle: true,
        });
        console.log('[esbuild] Build Complete');

        errors.forEach((error) => console.log(`[esbuild] ${error}`));
        warnings.forEach((warning) => console.log(`[esbuild] ${warning}`));

        // Build CSS
        const cssFrom = 'src/css/main.css';
        const cssTo = 'views/static/css/main-dist.css';
        const css = fs.readFileSync(cssFrom);

        postcss([postcssImport, stylelint, autoprefixer, postcssMinify])
            .process(css, { from: cssFrom, to: cssTo })
            .then((result) => {
                fs.writeFileSync(cssTo, result.css);
                console.log('[Postcss] Build Complete');
            });
    });

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
