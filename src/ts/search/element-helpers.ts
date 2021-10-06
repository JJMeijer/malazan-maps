import { Entry, FocusResultInformation } from '../types';
import Fuse from 'fuse.js';

const RESULT_INDEX_ATTRIBUTE = 'index';
const RESULT_NAME_ATTRIBUTE = 'name';
const RESULT_HREF_ATTRIBUTE = 'href';

export const getSearchResultsElement = (): HTMLElement => {
    const searchResultsElement = document.getElementById('search-results');

    if (!(searchResultsElement instanceof HTMLElement)) {
        throw new Error('searchResultsElement is unexpectedly missing');
    }

    return searchResultsElement;
};

export const getSearchWrapperElement = (): HTMLElement => {
    const searchWrapperElement = document.getElementById('search-wrapper');

    if (!(searchWrapperElement instanceof HTMLElement)) {
        throw new Error('searchWrapperElement is unexpectedly missing');
    }

    return searchWrapperElement;
};

export const getSearchInputElement = (): HTMLInputElement => {
    const searchInputElement = document.getElementById('search');

    if (!(searchInputElement instanceof HTMLInputElement)) {
        throw new Error('searchInputElement is unexpectedly missing');
    }

    return searchInputElement;
};

const boldMatchingIndices = (name: string, indices: readonly Fuse.RangeTuple[]): string => {
    let result = '';
    let position = 0;
    indices.forEach(([from, to], index) => {
        result += name.substring(position, from);
        position = to + 1;

        const replaceTarget = name.substring(from, to + 1);
        const replacement = `<span class="text-gray-800 font-bold">${replaceTarget}</span>`;

        result += replacement;

        if (index === indices.length - 1) {
            result += name.substring(to + 1, name.length);
        }
    });

    return result;
};

export const createSearchResult = (
    item: Entry,
    indices: readonly Fuse.RangeTuple[],
    index: number,
): HTMLElement => {
    const { name, slug, type } = item;
    const resultHref = `/${type}/${slug}/`;

    const resultWrapper = document.createElement('div');
    resultWrapper.classList.add('flex', 'flex-col', 'p-2', 'hover:bg-gray-300');
    resultWrapper.setAttribute(`data-${RESULT_INDEX_ATTRIBUTE}`, String(index));
    resultWrapper.setAttribute(`data-${RESULT_NAME_ATTRIBUTE}`, slug);
    resultWrapper.setAttribute(`data-${RESULT_HREF_ATTRIBUTE}`, resultHref);

    const resultLink = document.createElement('a');
    resultLink.href = resultHref;
    resultLink.classList.add('flex', 'flex-row');

    const resultName = document.createElement('p');
    resultName.innerHTML = boldMatchingIndices(name, indices);
    resultName.classList.add('w-3/4');

    const resultType = document.createElement('p');
    resultType.innerHTML = type;
    resultType.classList.add('w-1/4', 'opacity-50', 'text-right');

    resultLink.appendChild(resultName);
    resultLink.appendChild(resultType);
    resultWrapper.appendChild(resultLink);

    return resultWrapper;
};

export const createNoResult = (): HTMLElement => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('p-2', 'w-full');

    const text = document.createElement('p');
    text.innerHTML = 'No Results';

    wrapper.appendChild(text);

    return wrapper;
};

export const getCurrentFocusResult = (): FocusResultInformation => {
    const element = document.querySelector('.focus-result');

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

const FOCUS_CLASSES = ['focus-result', 'bg-gray-200', 'text-gray-800'];

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
