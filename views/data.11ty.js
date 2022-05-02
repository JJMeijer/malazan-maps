class Data {
    data() {
        return {
            permalink: "/data.json",
        };
    }

    render({ content }) {
        const searchData = content.map(({ name, slug, type }) => {
            return {
                name,
                slug,
                type,
            };
        });

        return JSON.stringify(searchData);
    }
}

module.exports = Data;
