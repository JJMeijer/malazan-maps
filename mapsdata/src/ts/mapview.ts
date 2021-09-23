import { getVisibleImage } from './mapview/element-helpers';

import { setZoomAndPanListeners } from './mapview/zoom-and-pan-listeners';
import { setMapSelectorListeners } from './mapview/map-selector-listener';

document.addEventListener('DOMContentLoaded', () => {
    const visibleImage = getVisibleImage();

    if (!(visibleImage instanceof HTMLImageElement)) {
        throw new Error('No Image Available map page');
    }

    if (visibleImage.complete) {
        setZoomAndPanListeners();
        setMapSelectorListeners();
    } else {
        visibleImage.addEventListener('load', () => {
            setZoomAndPanListeners();
            setMapSelectorListeners();
        });
    }
});
