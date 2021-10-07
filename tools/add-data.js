/* eslint-disable prettier/prettier */
const prompts = require('prompts');
const slugify = require('slugify');
const fs = require('fs');

const { wikiSearch, wikiSummary, wikiUrl } = require('./wiki');
const { validateContent } = require('./validate');

const maps = require('./maps.json');
const content = require('../views/_data/content.json');


(async () => {
    const response = await prompts([
        {
            type: 'text',
            name: 'search',
            message: 'Name',
        },
        {
            type: 'select',
            name: 'name',
            message: 'Select the correct location',
            choices: async (prev) => await wikiSearch(prev),
        },
        {
            type: 'select',
            name: 'type',
            message: 'Select a type',
            choices: [
                { title: 'City', value: 'city' },
                { title: 'Region', value: 'region' },
            ],
        },
        {
            type: 'select',
            name: 'map',
            message: 'Select a Map',
            choices: maps.map((x) => ({
                title: x.name,
                value: x,
            })),
        },
        {
            type: 'number',
            name: 'markerX',
            message: 'Enter X Coordinate',
        },
        {
            type: 'number',
            name: 'markerY',
            message: 'Enter Y Coordinate',
        },
    ]);

    const { name, type, map, markerX, markerY } = response;

    const slug = slugify(name, {
        lower: true,
        strict: true,
    });

    const wikiLink = await wikiUrl(name);
    const description = await wikiSummary(name);

    map.marker = {
        x: markerX,
        y: markerY,
    };

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

        fs.writeFileSync(__dirname + '/../views/_data/content.json', JSON.stringify(content, null, 4));
        console.log(`[${__filename}] Added new item: ${newItem.name}`);
        return;
    }

    const existingMap = content[existingItemIndex].maps.findIndex(
        (map) => map.name === newItem.maps[0].name,
    );

    if (existingMap) {
        console.log(`[${__filename}] Item With provided map already exists`);
        return;
    }

    content[existingItemIndex].maps.concat(newItem.maps);
    validateContent();
    fs.writeFileSync(__dirname + '/../views/_data/content.json', JSON.stringify(content, null, 4));
    console.log(`[${__filename}] Added map "${newItem.maps[0].name}" to existing Content Item "${newItem.name}".`);
})();
