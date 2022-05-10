const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ verbose: true });
addFormats(ajv);

const currentFile = require("../views/_data/content.json");
const maps = require("../views/_data/maps.json");

const mapsImagePattern = `^/static/img/maps/(${maps
    .map((x) => x.image.replace("/static/img/maps/", ""))
    .join("|")})$`;

const MapSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        image: { type: "string", format: "uri-reference", pattern: mapsImagePattern },
    },
    required: ["name", "image"],
};

const ItemSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        slug: { type: "string", pattern: "^[a-z-]+$" },
        description: { type: "string" },
        wikiLink: { type: "string", format: "uri", pattern: "^https://malazan.fandom.com/wiki/.+" },
        type: { type: "string", pattern: "book|continent|city|region" },
        maps: {
            type: "array",
            items: MapSchema,
        },
    },
    required: ["name", "slug", "description", "wikiLink", "type", "maps"],
};

const schema = {
    type: "array",
    items: ItemSchema,
};

const validateContent = (data) => {
    const validate = ajv.compile(schema);

    const valid = validate(data || currentFile);
    if (!valid) {
        console.log(`[${__filename}] Validation feedback:`, validate.errors);
        throw new Error(`[${__filename}] Validation Error, see log above`);
    }
    return valid;
};

module.exports = {
    validateContent,
};
