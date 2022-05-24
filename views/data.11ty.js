const slugify = require("@sindresorhus/slugify");

class Data {
    data() {
        return {
            permalink: "/data.json",
        };
    }

    render({ content, maps }) {
        const contentData = content.map(({ name, type }) => {
            return {
                name,
                slug: slugify(name, { decamelize: false }),
                type,
            };
        });

        const mapsData = maps.map(({ name }) => {
            return {
                name,
                slug: slugify(name, { decamelize: false }),
                type: "map",
            };
        });

        return JSON.stringify([...contentData, ...mapsData]);
    }
}

module.exports = Data;
