import { getElementRealDimensions } from './element-dimensions';

export const setVisibleMapTransformOrigin = (): void => {
    const visibleImageWrapper = document.querySelector('[id^="map-imagewrapper-"]:not(.hidden)');

    if (!(visibleImageWrapper instanceof HTMLDivElement)) {
        throw new Error('Imagewrapper element is missing');
    }

    const { top, left } = getElementRealDimensions(visibleImageWrapper);
    visibleImageWrapper.style.transformOrigin = `${-left}px ${-top}px`;
};
