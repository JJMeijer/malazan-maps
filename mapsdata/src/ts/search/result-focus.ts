import { RESULT_INDEX_ATTRIBUTE, RESULT_NAME_ATTRIBUTE, RESULT_HREF_ATTRIBUTE } from './constants';
import { FocusResultInformation } from './types';

const FOCUS_RESULT_CLASS = 'focus-result';

const FOCUS_CLASSES = [FOCUS_RESULT_CLASS, 'search-result-focussed'];

export const getCurrentFocusResult = (): FocusResultInformation => {
    const element = document.querySelector(`.${FOCUS_RESULT_CLASS}`);

    if (element instanceof HTMLElement) {
        const focusIndex = element.dataset[RESULT_INDEX_ATTRIBUTE];
        const focusName = element.dataset[RESULT_NAME_ATTRIBUTE];
        const focusHref = element.dataset[RESULT_HREF_ATTRIBUTE];

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
