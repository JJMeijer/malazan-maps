import { NaturalDimensions, RealDimensions, ElementPaddings } from '../types';

export const extractMapId = (elementIdString: string): string => {
    const lastKebabCaseItem = elementIdString.split('-').slice(-1);

    if (lastKebabCaseItem[0]) {
        return lastKebabCaseItem[0];
    }

    throw new Error('Map ID not found');
};

export const getVisibleImage = (): HTMLElement | null => {
    const visibleImageWrapper = document.querySelector('[id^="map-imagewrapper-"]:not(.hidden)');

    if (visibleImageWrapper) {
        const mapId = extractMapId(visibleImageWrapper.id);
        return document.querySelector(`#map-image-${mapId}`);
    }

    return null;
};

export const getElementNaturalDimensions = (element: HTMLImageElement): NaturalDimensions => {
    const { naturalHeight, naturalWidth } = element;

    return {
        naturalHeight,
        naturalWidth,
    };
};

export const getElementRealDimensions = (element: HTMLElement): RealDimensions => {
    const { width, height, top, left } = element.getBoundingClientRect();

    return {
        width,
        height,
        top,
        left,
    };
};

export const getElementPaddings = (element: HTMLElement): ElementPaddings => {
    const leftPadding = parseInt(
        window.getComputedStyle(element).getPropertyValue('padding-left').replace('px', ''),
    );

    const rightPadding = parseInt(
        window.getComputedStyle(element).getPropertyValue('padding-top').replace('px', ''),
    );

    const topPadding = parseInt(
        window.getComputedStyle(element).getPropertyValue('padding-top').replace('px', ''),
    );

    const bottomPadding = parseInt(
        window.getComputedStyle(element).getPropertyValue('padding-top').replace('px', ''),
    );

    return {
        leftPadding,
        rightPadding,
        topPadding,
        bottomPadding,
    };
};

export const setVisibleMapTransformOrigin = (): void => {
    const visibleImageWrapper = document.querySelector('[id^="map-imagewrapper-"]:not(.hidden)');

    if (!(visibleImageWrapper instanceof HTMLDivElement)) {
        throw new Error('Imagewrapper element is missing');
    }

    const { top, left } = getElementRealDimensions(visibleImageWrapper);
    visibleImageWrapper.style.transformOrigin = `${-left}px ${-top}px`;
};
