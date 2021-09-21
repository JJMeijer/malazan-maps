import { getVisibleImage } from './place/element-helpers';
import { placeVisibleMarker } from './place/place-marker';
import { setZoomAndPanListeners } from './place/zoom-and-pan-listener';
import { setMapSelectorListeners } from './place/map-selector-listener';

const initPlacePage = (): void => {
    placeVisibleMarker();
    setZoomAndPanListeners();

    window.addEventListener('resize', () => {
        placeVisibleMarker();
    });

    setMapSelectorListeners();
};

document.addEventListener('DOMContentLoaded', () => {
    const visibleImage = getVisibleImage();

    if (!(visibleImage instanceof HTMLImageElement)) {
        throw new Error('No Image Available on Marker page');
    }

    if (visibleImage.complete) {
        initPlacePage();
    } else {
        visibleImage.addEventListener('load', () => {
            initPlacePage();
        });
    }
});
