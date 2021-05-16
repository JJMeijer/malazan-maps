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

    const placeImageMarker = (mapId) => {
        const mapElement = document.getElementById(`map-image-${mapId}`);
        const markerElement = document.getElementById(`map-marker-${mapId}`);

        const mapNaturalDimensions = getElementNaturalDimensions(mapElement);
        const mapRealDimensions = getElementRealDimensions(mapElement);

        const markerRealDimensions = getElementRealDimensions(markerElement);

        const { markerx, markery } = markerElement.dataset;

        const markerRelativeX = Math.round(
            (markerx * mapRealDimensions.width) / mapNaturalDimensions.naturalWidth - (markerRealDimensions.width / 2)
        );

        const markerRelativeY = Math.round(
            (markery * mapRealDimensions.height) / mapNaturalDimensions.naturalHeight - markerRealDimensions.height
        );

        markerElement.style.top = `${markerRelativeY}px`;
        markerElement.style.left = `${markerRelativeX}px`;

        if (markerElement.classList.contains('opacity-0')) {
            markerElement.classList.remove('opacity-0');
        }
    };

    const handleMapSelectorChange = (event) => {
        const mapId = getMapId(event.target.id);

        const mapWrappers = document.querySelectorAll('[id^=map-imagewrapper-]');

        // Hide all maps
        mapWrappers.forEach((mapWrapper) => {
            if (!mapWrapper.classList.contains('hidden')) {
                mapWrapper.classList.add('hidden');
            }
        });

        // Remove hidden from selected Map
        document.getElementById(`map-imagewrapper-${mapId}`).classList.remove('hidden');

        // Place Marker in Selected Map
        placeImageMarker(mapId);
    };

    const setImageSelectorListener = () => {
        const mapButtons = document.querySelectorAll('input[name="map-selector"]');

        mapButtons.forEach((element) => {
            element.addEventListener('change', handleMapSelectorChange);
        });
    };

    const placeVisibleMarker = () => {
        const visibleImageWrapper = document.querySelector('[id^="map-imagewrapper-"]:not(.hidden)');
        const mapId = getMapId(visibleImageWrapper.id);

        placeImageMarker(mapId);
    };

    window.addEventListener('resize', placeVisibleMarker);

    setImageSelectorListener();
    placeVisibleMarker();
}());
