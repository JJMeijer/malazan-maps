import { getVisibleImage, setVisibleMapTransformOrigin } from './map/element-helpers';
import { setZoomAndPanListeners } from './map/zoom-and-pan-listeners';
import { setMapSelectorListeners } from './map/map-selector-listener';
import { placeVisibleMarker } from './map/place-marker';

const init = () => {
    setVisibleMapTransformOrigin();
    setZoomAndPanListeners();
    setMapSelectorListeners();
    placeVisibleMarker();

    window.addEventListener('resize', () => {
        placeVisibleMarker();
    });
};

const waitForImage = () => {
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
};

if (document.readyState !== 'loading') {
    waitForImage();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        waitForImage();
    });
}
