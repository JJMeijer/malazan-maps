import prompts from "prompts";
import { readFileSync, writeFileSync } from "fs";
import slugify from "@sindresorhus/slugify";
import { fileURLToPath } from "url";
import path from "path";

import { wikiSearch, wikiSummary, wikiUrl } from "./wiki.js";

const maps_file = readFileSync("views/_data/maps.json");
const maps = JSON.parse(maps_file);

const locationsFile = readFileSync("views/_data/locations.json");
const locations = JSON.parse(locationsFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const locationsPath = path.join(__dirname, "..", "views", "_data", "locations.json");

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
            name: "mapId",
            message: "Select a Map",
            choices: maps.map((x, index) => ({
                title: x.name,
                value: index + 1,
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

    const { name, type, mapId, marker, markerX, markerY } = response;

    if (!name || !type || !mapId || marker === undefined) {
        console.log("Cancelled");
        return;
    }

    if (marker && (!markerX || !markerY)) {
        console.log("Cancelled");
        return;
    }

    const slug = slugify(name, { decamelize: false });
    const wikiLink = await wikiUrl(name);
    const description = await wikiSummary(name);

    const map = {
        id: mapId - 1,
    };

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

    const existingItemIndex = locations.findIndex((item) => item.name === name);
    const isNew = existingItemIndex === -1;

    if (isNew) {
        locations.push(newItem);
        locations.sort((a, b) => a.name.localeCompare(b.name));

        writeFileSync(locationsPath, JSON.stringify(locations, null, 4));
        console.log(`Added new item: ${newItem.name}`);
        return;
    }

    const existingMap = locations[existingItemIndex].maps.findIndex(
        (map) => map.id === newItem.maps[0].id,
    );

    if (existingMap > -1) {
        console.log(`Item With provided map already exists`);
        return;
    }

    locations[existingItemIndex].maps.push(newItem.maps[0]);
    writeFileSync(locationsPath, JSON.stringify(locations, null, 4));
    console.log(
        `Added map "${maps[newItem.maps[0].id].name}" to existing Content Item "${newItem.name}".`,
    );
})();
