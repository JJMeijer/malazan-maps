const locations = require("../views/_data/locations.json");

const result = locations.sort((a, b) => {
    if (a.description.length > b.description.length) {
        return -1;
    }

    if (a.description.length < b.description.length) {
        return 1;
    }

    return 0;
});

console.log(result.slice(0, 9));
