import {
    getElementNaturalDimensions,
    getElementRealDimensions,
    getElementPaddings,
} from './element-dimensions';
import { extractMapId } from './extract-map-id';

export const placeVisibleMarker = (): void => {
    /**
     * Check if a marker element is on the page because they are only
     * there on city & region pages
     */
    if (document.querySelectorAll('[id^="map-marker-"]').length === 0) {
        return;
    }

    const visibleImageWrapper = document.querySelector('[id^="map-imagewrapper-"]:not(.hidden)');

    if (!(visibleImageWrapper instanceof HTMLDivElement)) {
        throw new Error('Imagewrapper element is missing');
    }

    const mapId = extractMapId(visibleImageWrapper.id);
    placeMarker(mapId);
};

const placeMarker = (mapId: string): void => {
    const mapImageWrapperElement = document.getElementById(`map-imagewrapper-${mapId}`);
    const mapImageElement = document.getElementById(`map-image-${mapId}`);
    const mapMarkerElement = document.getElementById(`map-marker-${mapId}`);

    if (!(mapImageWrapperElement instanceof HTMLDivElement)) {
        throw new Error(`Imagewrapper for mapId ${mapId} is missing`);
    }

    if (!(mapImageElement instanceof HTMLImageElement)) {
        throw new Error(`Image for mapId ${mapId} is missing`);
    }

    if (!(mapMarkerElement instanceof HTMLImageElement)) {
        throw new Error(`Marker icon for mapId ${mapId} is missing`);
    }

    const mapNaturalDimensions = getElementNaturalDimensions(mapImageElement);
    const mapRealDimensions = getElementRealDimensions(mapImageElement);

    const markerRealDimensions = getElementRealDimensions(mapMarkerElement);

    const { leftPadding, topPadding } = getElementPaddings(mapImageWrapperElement);

    const { markerx, markery } = mapMarkerElement.dataset;

    if (!markerx || !markery) {
        throw new Error('Marker coordinates not provided');
    }

    const markerRelativeX =
        Math.round(
            (parseInt(markerx) * mapRealDimensions.width) / mapNaturalDimensions.naturalWidth -
                markerRealDimensions.width / 2,
        ) + leftPadding;

    const markerRelativeY =
        Math.round(
            (parseInt(markery) * mapRealDimensions.height) / mapNaturalDimensions.naturalHeight -
                markerRealDimensions.height,
        ) + topPadding;

    // Padding issues :()

    mapMarkerElement.style.top = `${markerRelativeY}px`;
    mapMarkerElement.style.left = `${markerRelativeX}px`;

    mapMarkerElement.classList.replace('opacity-0', 'opacity-80');
};
