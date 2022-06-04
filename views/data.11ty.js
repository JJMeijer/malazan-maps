class Data {
    data() {
        return {
            permalink: "/data.json",
        };
    }

    render({ content }) {
        const contentData = content.map(({ name, slug, type }) => {
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
