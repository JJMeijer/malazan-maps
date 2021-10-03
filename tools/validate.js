const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ verbose: true });
addFormats(ajv);

const content = require('../views/_data/content.json');

const MapSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        image: { type: 'string', format: 'uri-reference' },
    },
    required: ['name', 'image'],
};

const ItemSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        slug: { type: 'string', pattern: '^[a-z-]+$' },
        description: { type: 'string' },
        wikiLink: { type: 'string', format: 'uri', pattern: '^https://malazan.fandom.com/wiki/.+' },
        type: { type: 'string', pattern: 'book|continent|city|region' },
        maps: {
            type: 'array',
            items: MapSchema,
        },
    },
    required: ['name', 'slug', 'description', 'wikiLink', 'type', 'maps'],
};

const schema = {
    type: 'array',
    items: ItemSchema,
};

const validate = ajv.compile(schema);

const valid = validate(content);
if (!valid) {
    console.log(validate.errors);
}
