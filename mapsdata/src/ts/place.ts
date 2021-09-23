import { getVisibleImage } from './mapview/element-helpers';
import { placeVisibleMarker } from './place/place-marker';

const initPlacePage = (): void => {
    placeVisibleMarker();

    window.addEventListener('resize', () => {
        placeVisibleMarker();
    });
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
