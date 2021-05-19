import { NaturalDimensions, RealDimensions } from './types';

export const getElementNaturalDimensions = (element: HTMLImageElement): NaturalDimensions => {
    const { naturalHeight, naturalWidth } = element;

    return {
        naturalHeight,
        naturalWidth,
    };
};

export const getElementRealDimensions = (element: HTMLElement): RealDimensions => {
    const { width, height } = element.getBoundingClientRect();

    return {
        width,
        height,
    };
};
