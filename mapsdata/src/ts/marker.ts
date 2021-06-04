export interface NaturalDimensions {
    naturalWidth: number;
    naturalHeight: number;
}

export interface RealDimensions {
    width: number;
    height: number;
}

const getElementNaturalDimensions = (element: HTMLImageElement): NaturalDimensions => {
    const { naturalHeight, naturalWidth } = element;

    return {
        naturalHeight,
        naturalWidth,
    };
};

const getElementRealDimensions = (element: HTMLElement): RealDimensions => {
    const { width, height } = element.getBoundingClientRect();

    return {
        width,
        height,
    };
};

const placeImageMarker = (mapId: string): void => {
    const mapElement = document.getElementById(`map-image-${mapId}`);
    const markerElement = document.getElementById(`map-marker-${mapId}`);

    if (mapElement instanceof HTMLImageElement && markerElement instanceof HTMLElement) {
        const mapNaturalDimensions = getElementNaturalDimensions(mapElement);
        const mapRealDimensions = getElementRealDimensions(mapElement);

        const markerRealDimensions = getElementRealDimensions(markerElement);

        const { markerx, markery } = markerElement.dataset;

        if (markerx && markery) {
            const markerRelativeX = Math.round(
                (parseInt(markerx) * mapRealDimensions.width) / mapNaturalDimensions.naturalWidth -
                    markerRealDimensions.width / 2,
            );

            const markerRelativeY = Math.round(
                (parseInt(markery) * mapRealDimensions.height) /
                    mapNaturalDimensions.naturalHeight -
                    markerRealDimensions.height,
            );

            markerElement.style.top = `${markerRelativeY}px`;
            markerElement.style.left = `${markerRelativeX}px`;

            markerElement.classList.remove('opacity-0');
            markerElement.classList.add('opacity-90');
        } else {
            throw new Error('Marker coordinates not provided');
        }
    } else {
        throw new Error('Invalid Map or Marker element');
    }
};

const getMapId = (text: string): string => {
    const lastKebabCaseItem = text.split('-').slice(-1);

    if (lastKebabCaseItem[0]) {
        return lastKebabCaseItem[0];
    }

    throw new Error('Map ID not found');
};

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

const getVisibleImage = (): HTMLElement | null => {
    const visibleImageWrapper = document.querySelector('[id^="map-imagewrapper-"]:not(.hidden)');

    if (visibleImageWrapper) {
        const mapId = getMapId(visibleImageWrapper.id);
        return document.querySelector(`#map-image-${mapId}`);
    }

    return null;
};

const initMarkerPage = (): void => {
    placeVisibleMarker();
    window.addEventListener('resize', placeVisibleMarker);
    setImageSelectorListener();
};

document.addEventListener('DOMContentLoaded', () => {
    const visibleImage = getVisibleImage();

    if (visibleImage === null || !(visibleImage instanceof HTMLImageElement)) {
        throw new Error('No Image Available on Marker page');
    }

    if (visibleImage.complete) {
        initMarkerPage();
    } else {
        visibleImage.addEventListener('load', () => {
            initMarkerPage();
        });
    }
});
