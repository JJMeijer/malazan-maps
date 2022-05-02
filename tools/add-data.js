const prompts = require("prompts");
const slugify = require("slugify");
const fs = require("fs");

const { wikiSearch, wikiSummary, wikiUrl } = require("./wiki");
const { validateContent } = require("./validate");

const maps = require("./maps.json");
const content = require("../views/_data/content.json");

(async () => {
    console.clear();
    const response = await prompts([
        {
            type: "text",
            name: "search",
            message: "Name",
        },
        {
            type: "select",
            name: "name",
            message: "Select the correct location",
            choices: async (prev) => await wikiSearch(prev),
        },
        {
            type: "autocomplete",
            name: "type",
            message: "Select a type",
            choices: [
                { title: "City", value: "city" },
                { title: "Region", value: "region" },
                { title: "Book", value: "book" },
                { title: "Continent", value: "continent" },
            ],
        },
        {
            type: "autocomplete",
            name: "map",
            message: "Select a Map",
            choices: maps.map((x) => ({
                title: x.name,
                value: x,
            })),
        },
        {
            type: "confirm",
            name: "marker",
            message: "Add Marker",
            initial: true,
        },
        {
            type: (_prev, values) => {
                return values.marker ? "number" : null;
            },
            name: "markerX",
            message: "Enter X Coordinate",
        },
        {
            type: (_prev, values) => (values.marker ? "number" : null),
            name: "markerY",
            message: "Enter Y Coordinate",
        },
    ]);

    const { name, type, map, marker, markerX, markerY } = response;

    if (!name || !type || !map || marker === undefined) {
        console.log("Cancelled");
        return;
    }

    if (marker && (!markerX || !markerY)) {
        console.log("Cancelled");
        return;
    }

    const slug = slugify(name, {
        lower: true,
        strict: true,
    });

    const wikiLink = await wikiUrl(name);
    const description = await wikiSummary(name);

    if (marker) {
        map.marker = {
            x: markerX,
            y: markerY,
        };
    }

    const newItem = {
        name,
        slug,
        description,
        wikiLink,
        type,
        maps: [map],
    };

    const existingItemIndex = content.findIndex((item) => item.name === name);
    const isNew = existingItemIndex === -1;

    if (isNew) {
        content.push(newItem);
        content.sort((a, b) => a.name.localeCompare(b.name));

        validateContent(content);

        fs.writeFileSync(
            __dirname + "/../views/_data/content.json",
            JSON.stringify(content, null, 4),
        );
        console.log(`Added new item: ${newItem.name}`);
        return;
    }

    const existingMap = content[existingItemIndex].maps.findIndex(
        (map) => map.name === newItem.maps[0].name,
    );

    if (existingMap > -1) {
        console.log(`Item With provided map already exists`);
        return;
    }

    content[existingItemIndex].maps.push(newItem.maps[0]);
    validateContent();
    fs.writeFileSync(__dirname + "/../views/_data/content.json", JSON.stringify(content, null, 4));
    console.log(`Added map "${newItem.maps[0].name}" to existing Content Item "${newItem.name}".`);
})();
