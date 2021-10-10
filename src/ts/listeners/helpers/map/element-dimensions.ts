import { NaturalDimensions, RealDimensions, ElementPaddings } from '../../../types';

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
