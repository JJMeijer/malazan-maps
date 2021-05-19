define("get-map-id", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getMapId = void 0;
    const getMapId = (text) => {
        const lastKebabCaseItem = text.split('-').slice(-1);
        if (lastKebabCaseItem[0]) {
            return lastKebabCaseItem[0];
        }
        throw new Error('Map ID not found');
    };
    exports.getMapId = getMapId;
});
define("types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("get-element-dimensions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getElementRealDimensions = exports.getElementNaturalDimensions = void 0;
    const getElementNaturalDimensions = (element) => {
        const { naturalHeight, naturalWidth } = element;
        return {
            naturalHeight,
            naturalWidth,
        };
    };
    exports.getElementNaturalDimensions = getElementNaturalDimensions;
    const getElementRealDimensions = (element) => {
        const { width, height } = element.getBoundingClientRect();
        return {
            width,
            height,
        };
    };
    exports.getElementRealDimensions = getElementRealDimensions;
});
define("place-image-marker", ["require", "exports", "get-element-dimensions"], function (require, exports, get_element_dimensions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.placeImageMarker = void 0;
    const placeImageMarker = (mapId) => {
        const mapElement = document.getElementById(`map-image-${mapId}`);
        const markerElement = document.getElementById(`map-marker-${mapId}`);
        if (mapElement instanceof HTMLImageElement && markerElement instanceof HTMLElement) {
            const mapNaturalDimensions = get_element_dimensions_1.getElementNaturalDimensions(mapElement);
            const mapRealDimensions = get_element_dimensions_1.getElementRealDimensions(mapElement);
            const markerRealDimensions = get_element_dimensions_1.getElementRealDimensions(markerElement);
            const { markerx, markery } = markerElement.dataset;
            if (markerx && markery) {
                const markerRelativeX = Math.round((parseInt(markerx) * mapRealDimensions.width) / mapNaturalDimensions.naturalWidth -
                    markerRealDimensions.width / 2);
                const markerRelativeY = Math.round((parseInt(markery) * mapRealDimensions.height) /
                    mapNaturalDimensions.naturalHeight -
                    markerRealDimensions.height);
                markerElement.style.top = `${markerRelativeY}px`;
                markerElement.style.left = `${markerRelativeX}px`;
                if (markerElement.classList.contains('opacity-0')) {
                    markerElement.classList.remove('opacity-0');
                }
            }
            else {
                throw new Error('Marker coordinates not provided');
            }
        }
        else {
            throw new Error('Invalid Map or Marker element');
        }
    };
    exports.placeImageMarker = placeImageMarker;
});
define("city", ["require", "exports", "get-map-id", "place-image-marker"], function (require, exports, get_map_id_1, place_image_marker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const handleMapSelectorChange = (event) => {
        const target = event.target; // Assumption that event.target exists
        const mapId = get_map_id_1.getMapId(target.id);
        const mapWrappers = document.querySelectorAll('[id^=map-imagewrapper-]');
        // Hide all maps
        mapWrappers.forEach((mapWrapper) => {
            if (!mapWrapper.classList.contains('hidden')) {
                mapWrapper.classList.add('hidden');
            }
        });
        // Remove hidden from selected Map
        const selectedImageWrapper = document.getElementById(`map-imagewrapper-${mapId}`);
        if (selectedImageWrapper) {
            selectedImageWrapper.classList.remove('hidden');
        }
        // Place Marker in Selected Map
        place_image_marker_1.placeImageMarker(mapId);
    };
    const setImageSelectorListener = () => {
        const mapButtons = document.querySelectorAll('input[name="map-selector"]');
        mapButtons.forEach((element) => {
            element.addEventListener('change', handleMapSelectorChange);
        });
    };
    const placeVisibleMarker = () => {
        const visibleImageWrapper = document.querySelector('[id^="map-imagewrapper-"]:not(.hidden)');
        if (visibleImageWrapper) {
            const mapId = get_map_id_1.getMapId(visibleImageWrapper.id);
            place_image_marker_1.placeImageMarker(mapId);
        }
    };
    window.addEventListener('resize', placeVisibleMarker);
    setImageSelectorListener();
    placeVisibleMarker();
});
