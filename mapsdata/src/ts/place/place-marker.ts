import {
    getElementNaturalDimensions,
    getElementRealDimensions,
    getElementPaddings,
    extractMapId,
    setElementTransformOrigin,
} from './element-helpers';

export const placeVisibleMarker = (): void => {
    const visibleImageWrapper = document.querySelector('[id^="map-imagewrapper-"]:not(.hidden)');

    if (!(visibleImageWrapper instanceof HTMLDivElement)) {
        throw new Error('Imagewrapper element is missing');
    }

    const mapId = extractMapId(visibleImageWrapper.id);
    placeMarker(mapId);
    setElementTransformOrigin(visibleImageWrapper);
};

export const placeMarker = (mapId: string): void => {
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

    mapMarkerElement.style.opacity = '0.85';
};
