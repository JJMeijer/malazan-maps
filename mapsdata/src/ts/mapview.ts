import { getVisibleImage, setVisibleMapTransformOrigin } from './mapview/element-helpers';
import { setZoomAndPanListeners } from './mapview/zoom-and-pan-listeners';
import { setMapSelectorListeners } from './mapview/map-selector-listener';
import { placeVisibleMarker } from './mapview/place-marker';

const init = () => {
    setVisibleMapTransformOrigin();
    setZoomAndPanListeners();
    setMapSelectorListeners();
    placeVisibleMarker();

    window.addEventListener('resize', () => {
        placeVisibleMarker();
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const visibleImage = getVisibleImage();

    if (!(visibleImage instanceof HTMLImageElement)) {
        throw new Error('No Image Available map page');
    }

    if (visibleImage.complete) {
        init();
    } else {
        visibleImage.addEventListener('load', () => {
            init();
        });
    }
});
