import prompts from "prompts";
import { readFileSync, existsSync } from "fs";

const mapsFile = readFileSync("views/_data/maps.json");
const maps = JSON.parse(mapsFile);

const locationsFile = readFileSync("views/_data/locations.json");
const locations = JSON.parse(locationsFile);

const readProgressFile = (mapId) => {
    const PROGRESS_PATH = `tmp/map-${mapId}-progress.json`;
    if (!mapId) return null;
    if (!existsSync(PROGRESS_PATH)) return null;

    const progressFile = readFileSync(PROGRESS_PATH);
    return JSON.parse(progressFile);
};

const getInitialProgress = (mapId) => {
    const locs = locations.filter((loc) => loc.maps.find((map) => map.id === mapId));
    return locs.map((loc) => ({
        name: loc.name,
        slug: loc.slug,
        x: null,
        y: null,
    }));
};

(async () => {
    console.clear();
    const response = await prompts([
        {
            type: "autocomplete",
            name: "mapId",
            message: "Select a Map to redo markers for",
            choices: maps.map((x, index) => ({
                title: x.name,
                value: index + 1,
            })),
        },
        {
            type: (prev) => (prev ? "toggle" : null),
            name: "useProgress",
            message: "Use existing progress file if available?",
            initial: true,
            active: "Yes",
            inactive: "No",
        },
        {
            type: (_prev, values) => {
                const { useProgress, mapId } = values;

                const progress = (useProgress && readProgressFile(mapId)) || getInitialProgress(mapId);

                // generate questions for inner prompts loop
                // check if we can write to progress after each entry (maybe with prev)

                console.log(progress);
            },
            message: "Redo markers (not implemented yet)",
        },
    ]);

    console.log(response);
})();
