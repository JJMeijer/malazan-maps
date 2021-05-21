import { FOCUS_RESULT_CLASS, FOCUS_CLASSES } from './constants';
import { FocusResultInformation } from './types';

export const getCurrentFocusResult = (): FocusResultInformation => {
    const element = document.querySelector(`.${FOCUS_RESULT_CLASS}`);

    if (element instanceof HTMLElement) {
        const focusIndex = element.dataset['index'];
        const focusName = element.dataset['name'];
        const focusHref = element.dataset['link'];

        if (focusName && focusIndex && focusHref) {
            return {
                focusName,
                focusIndex: parseInt(focusIndex),
                focusHref,
            };
        }

        throw new Error('Focussed Result had unexpected format');
    }

    return {
        focusName: '',
        focusIndex: 0,
        focusHref: '',
    };
};

export const unSetFocusResult = (resultIndex: number): void => {
    const element = document.querySelector(`[data-index="${resultIndex}"]`);

    if (element !== null) {
        element.classList.remove(...FOCUS_CLASSES);
    }
};

export const setFocusResult = (resultIndex: number): void => {
    const element = document.querySelector(`[data-index="${resultIndex}"]`);

    if (element !== null) {
        element.classList.add(...FOCUS_CLASSES);
    }
};
