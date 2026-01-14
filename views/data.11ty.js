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

export default Data;
