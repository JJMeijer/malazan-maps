import prompts from "prompts";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";

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
    const locs = locations.filter((loc) => loc.type.match("city|region") && loc.maps.find((map) => map.id === mapId));
    return locs.map((loc) => ({
        name: loc.name,
        slug: loc.slug,
        x: null,
        y: null,
    }));
};

const saveProgressFile = (mapId, progress) =>
    writeFileSync(`tmp/map-${mapId}-progress.json`, JSON.stringify(progress, null, 4));

(async () => {
    console.clear();

    if (!existsSync("tmp")) {
        mkdirSync("tmp");
    }

    let progress = [];

    const response = await prompts([
        {
            type: "autocomplete",
            name: "mapId",
            message: "Select a Map to redo markers for",
            choices: maps.map((x, index) => ({
                title: x.name,
                value: index,
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

                progress = (useProgress && readProgressFile(mapId)) || getInitialProgress(mapId);
                saveProgressFile(mapId, progress);

                return "confirm";
            },
            name: "startRedo",
            message: () => {
                const toDo = progress.filter((item) => item.x === null || item.y === null).length;
                return `There are ${toDo} markers to redo. Start now?`;
            },
            initial: true,
        },
        {
            type: (_prev, values) => (values.startRedo ? "invisible" : null),
            name: "redoMarkers",
            message: async (_prev, values) => {
                const { mapId } = values;

                const results = await prompts(
                    progress.map((item, index) => ({
                        type: (prev) => {
                            if (prev && index > 0) {
                                const [x, y] = prev.split(",").map((coord) => parseFloat(coord.trim()));
                                progress[index - 1].x = x;
                                progress[index - 1].y = y;
                                saveProgressFile(mapId, progress);
                            }

                            if (item.x === null || item.y === null) return "text";
                            return null;
                        },
                        name: `${item.slug}`,
                        message: `coordinates for ${item.name} in x, y format:`,
                    })),
                );

                // save last item
                const lastItem = progress[progress.length - 1];
                if (lastItem.x === null || lastItem.y === null) {
                    const lastCoords = results[`${lastItem.slug}`];
                    if (lastCoords) {
                        const [x, y] = lastCoords.split(",").map((coord) => parseFloat(coord.trim()));
                        lastItem.x = x;
                        lastItem.y = y;
                        saveProgressFile(mapId, progress);
                    }
                }

                return "Done!";
            },
        },
    ]);

    // check if done
    const toDo = progress.filter((item) => item.x === null || item.y === null).length;
    if (toDo === 0) {
        const res = await prompts({
            type: "confirm",
            name: "finalize",
            message: "All markers done! Process into locations file?",
            initial: true,
        });

        if (res.finalize) {
            console.log(`Adding locations for map ${response.mapId}...`);
            progress.forEach((pItem) => {
                const locIndex = locations.findIndex((loc) => loc.slug === pItem.slug);
                if (locIndex !== -1) {
                    const mapIndex = locations[locIndex].maps.findIndex((m) => m.id === response.mapId);
                    if (mapIndex !== -1) {
                        locations[locIndex].maps[mapIndex].marker = {
                            x: pItem.x,
                            y: pItem.y,
                        };
                    }
                }
            });
            // save locations file
            writeFileSync("views/_data/locations.json", JSON.stringify(locations, null, 4));
        }
    }
})();
