import htmlmin from "html-minifier-next";
import { format } from "date-fns";

export default function (config) {
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
    config.addTransform("htmlmin", async function (content, outputPath) {
        if (outputPath && outputPath.endsWith(".html")) {
            let minified = await htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
            });
            return minified;
        }

        return content;
    });

    config.addCollection("continents", function (collectionApi) {
        return collectionApi
            .getAll()
            .filter((x) => x.url.match(/^\/continent\//))
            .sort((a, b) => {
                if (a.data.item.maps.length > b.data.item.maps.length) {
                    return -1;
                }

                if (a.data.item.maps.length < b.data.item.maps.length) {
                    return 1;
                }

                return 0;
            });
    });
    config.addCollection("books", function (collectionApi) {
        return collectionApi
            .getAll()
            .filter((x) => x.url.match(/^\/book\//))
            .sort((a, b) => {
                if (a.data.item.series === b.data.item.series) {
                    return a.data.item.number < b.data.item.number
                        ? -1
                        : a.data.item.number > b.data.item.number
                          ? 1
                          : 0;
                }

                return a.data.item.series > b.data.item.series ? -1 : a.data.item.series < b.data.item.series ? 1 : 0;
            });
    });

    // Set Directories
    return {
        dir: {
            input: "views",
            output: "www",
        },
    };
}
