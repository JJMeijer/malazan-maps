import { getElementNaturalDimensions, getElementRealDimensions } from './get-element-dimensions';

export const placeImageMarker = (mapId: string): void => {
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

            if (markerElement.classList.contains('opacity-0')) {
                markerElement.classList.remove('opacity-0');
            }
        } else {
            throw new Error('Marker coordinates not provided');
        }
    } else {
        throw new Error('Invalid Map or Marker element');
    }
};
