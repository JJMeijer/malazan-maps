class Data {
    data() {
        return {
            permalink: '/data.json',
        };
    }

    render({ content }) {
        return JSON.stringify(content);
    }
}

module.exports = Data;
