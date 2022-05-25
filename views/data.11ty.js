class Data {
    data() {
        return {
            permalink: "/data.json",
        };
    }

    render({ content, maps }) {
        const contentData = content.map(({ name, slug, type }) => {
            return {
                name,
                slug,
                type,
            };
        });

        const mapsData = maps.map(({ name, slug }) => {
            return {
                name,
                slug,
                type: "map",
            };
        });

        return JSON.stringify([...contentData, ...mapsData]);
    }
}

module.exports = Data;
