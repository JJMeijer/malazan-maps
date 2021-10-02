const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ verbose: true });
addFormats(ajv);

const books = require('../views/_data/books.json');
const continents = require('../views/_data/continents.json');
const places = require('../views/_data/places.json');

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
        description: { type: 'string' },
        wikiLink: { type: 'string', format: 'uri', pattern: '^https://malazan.fandom.com/wiki/.+' },
        type: { type: 'string', pattern: 'book|continent|city|region' },
        maps: {
            type: 'array',
            items: MapSchema,
        },
    },
    required: ['name', 'description', 'wikiLink', 'type', 'maps'],
};

const schema = {
    type: 'array',
    items: ItemSchema,
};

const validate = ajv.compile(schema);

const validBooks = validate(books);
if (!validBooks) {
    console.log(validate.errors);
}

const validContinents = validate(continents);
if (!validContinents) {
    console.log(validate.errors);
}

const validPlaces = validate(places);
if (!validPlaces) {
    console.log(validate.errors);
}
