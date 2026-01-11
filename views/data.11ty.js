class Data {
    data() {
        return {
            permalink: "/data.json",
        };
    }

    render({ locations }) {
        const contentData = locations.map(({ name, slug, type }) => {
            return {
                name,
                slug,
                type,
            };
        });

        return JSON.stringify(contentData);
    }
}

module.exports = Data;
