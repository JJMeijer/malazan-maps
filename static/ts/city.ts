import { getMapId } from './get-map-id';
import { placeImageMarker } from './place-image-marker';

const handleMapSelectorChange = (event: Event) => {
    const target = event.target as HTMLElement; // Assumption that event.target exists
    const mapId = getMapId(target.id);

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

    if (visibleImageWrapper) {
        const mapId = getMapId(visibleImageWrapper.id);
        placeImageMarker(mapId);
    }
};

window.addEventListener('resize', placeVisibleMarker);

setImageSelectorListener();
placeVisibleMarker();
