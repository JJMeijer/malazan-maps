const content = require("../views/_data/content.json");

const places = content.length;
const markers = content.reduce((result, current) => {
    return (result += current.maps.length);
}, 0);

const cities = content.filter((x) => x.type === "city").length;
const regions = content.filter((x) => x.type === "region").length;
const books = content.filter((x) => x.type === "book").length;
const continents = content.filter((x) => x.type === "continent").length;

const maps = [].concat
    .apply(
        [],
        content.map((x) => x.maps),
    )
    .map((x) => x.name)
    .filter((item, index, arr) => arr.indexOf(item) === index);

const mapsSummary = maps
    .map((mapName) => {
        const places = content.filter((x) => x.maps.filter((y) => y.name === mapName).length > 0);
        const cities = places.filter((x) => x.type === "city").length;
        const regions = places.filter((x) => x.type === "region").length;

        return {
            name: mapName,
            places: places.length,
            cities,
            regions,
        };
    })
    .sort((a, b) => {
        if (a.places > b.places) {
            return -1;
        }

        if (a.places < b.places) {
            return 1;
        }

        return 0;
    });

const totals = [
    {
        name: "markers",
        "#": markers,
    },
    {
        name: "places",
        "#": places,
    },
    {
        name: "cities",
        "#": cities,
    },
    {
        name: "regions",
        "#": regions,
    },
    {
        name: "maps",
        "#": maps.length,
    },
    {
        name: "books",
        "#": books,
    },
    {
        name: "continents",
        "#": continents,
    },
];

console.table(totals);
console.table(mapsSummary);
