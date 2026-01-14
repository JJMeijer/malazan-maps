/**
 * Return all places registered for a certain map. Currently not in use, but can be used
 * for map pages to display relevant place information on hover or tap.
 */
class Places {
    data() {
        return {
            pagination: {
                data: "maps",
                size: 1,
                alias: "map",
            },
            permalink: function (data) {
                const {
                    map: { slug },
                } = data;
                return `map/${slug}/places.json`;
            },
        };
    }

    render(data) {
        const {
            locations,
            pagination: { pageNumber: mapIndex },
        } = data;

        const places = locations.filter((place) => {
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

export default Places;
