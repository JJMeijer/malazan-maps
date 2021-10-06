const prompts = require('prompts');
const slugify = require('slugify');
const { wikiSearch, wikiSummary, wikiUrl } = require('./wiki');
const maps = require('./maps.json');

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

    console.log({
        name,
        slug,
        description,
        wikiLink,
        type,
        maps: [map],
    });
})();
