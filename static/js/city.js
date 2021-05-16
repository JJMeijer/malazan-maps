(function wrapper() {
    /**
     * Retrieve last item in test-test-test string. splitted by '-'
     */
    const getMapId = (text) => text.split('-').slice(-1)[0];

    const getElementNaturalDimensions = (element) => {
        const { naturalHeight, naturalWidth } = element;

        return {
            naturalHeight,
            naturalWidth,
        };
    };

    const getElementRealDimensions = (element) => {
        const { width, height } = element.getBoundingClientRect();

        return {
            width,
            height,
        };
    };

    const setupImageSelector = () => {
        const mapButtons = document.querySelectorAll('input[name="map-selector"]');
        const maps = document.querySelectorAll('[id^=map-imagewrapper-]');

        mapButtons.forEach((element) => {
            element.addEventListener('change', (event) => {
                const mapId = getMapId(event.target.id);

                maps.forEach((map) => {
                    if (!map.classList.contains('hidden')) {
                        map.classList.add('hidden');
                    }
                });

                document.getElementById(`map-imagewrapper-${mapId}`).classList.remove('hidden');
            });
        });
    };

    const setupImageMarkers = () => {
        const markers = document.querySelectorAll('[id^=map-marker-');

        // Initial setup
        markers.forEach((marker) => {
            const mapId = getMapId(marker.id);
            const mapElement = document.getElementById(`map-image-${mapId}`);
            const markerElement = document.getElementById(`map-marker-${mapId}`);

            const mapNaturalDimensions = getElementNaturalDimensions(mapElement);
            const mapRealDimensions = getElementRealDimensions(mapElement);

            const markerRealDimensions = getElementRealDimensions(markerElement);

            const { markerx, markery } = marker.dataset;

            const markerRelativeX = Math.round(
                (markerx * mapRealDimensions.width) / mapNaturalDimensions.naturalWidth - (markerRealDimensions.width / 2)
            );

            const markerRelativeY = Math.round(
                (markery * mapRealDimensions.height) / mapNaturalDimensions.naturalHeight - markerRealDimensions.height
            );

            marker.style.top = `${markerRelativeY}px`;
            marker.style.left = `${markerRelativeX}px`;

            marker.classList.remove('opacity-0');
        });
    };

    setupImageSelector();
    setupImageMarkers();
}());
