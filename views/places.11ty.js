/**
 * Return all places registered for a certain map. Currently not in use, but can be used
 * for map pages to display relevant place information on hover or tap.
 */
const slugify = require("@sindresorhus/slugify");

class Places {
    data() {
        return {
            pagination: {
                data: "maps",
                size: 1,
                alias: "map",
            },
            permalink: ({ map: { name } }) =>
                `map/${slugify(name, { decamelize: false })}/places.json`,
        };
    }

    render(data) {
        const {
            content,
            pagination: { pageNumber: mapIndex },
        } = data;

        const places = content.filter((place) => {
            return place.maps.find((x) => x.id === mapIndex && x.marker);
        });

        const mappedPlaces = places.map((place) => {
            const { name, slug, description, type, wikiLink, maps } = place;

            const marker = maps.find((x) => x.id === mapIndex).marker;

            return {
                name,
                slug,
                description,
                type,
                wikiLink,
                marker,
            };
        });

        return JSON.stringify(mappedPlaces);
    }
}

module.exports = Places;
