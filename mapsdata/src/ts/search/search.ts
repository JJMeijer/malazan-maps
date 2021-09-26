import { createSearchResult, createNoResult } from './result-element';
import { getCurrentFocusResult, setFocusResult, unSetFocusResult } from './result-focus';

import { RESULT_MAX_ITEMS } from './constants';
import { Entry } from '../types';

const getSearchEntries = (): Entry[] => {
    const entriesElement = document.getElementById('entries');

    if (!(entriesElement instanceof HTMLScriptElement)) {
        throw new Error('Search Entries element missing');
    }

    if (!entriesElement.textContent) {
        throw new Error('Search Entries element has no content');
    }

    return JSON.parse(entriesElement.textContent);
};

export const handleSearchInput = (event: Event, searchResultsBox: HTMLElement): void => {
    if (!(event.target instanceof HTMLInputElement)) {
        throw new Error('Unexpected target of search input event.');
    }

    const { value } = event.target;
    const { focusName, focusIndex } = getCurrentFocusResult();
    const entries = getSearchEntries();

    searchResultsBox.innerHTML = '';

    if (value.length > 0) {
        const results = entries
            .filter(({ name }) => {
                return name.match(new RegExp(value, 'i'));
            })
            .sort(({ name: nameA }, { name: nameB }) => {
                const indexA = nameA.toLowerCase().indexOf(value.toLowerCase());
                const indexB = nameB.toLowerCase().indexOf(value.toLowerCase());

                if (indexA < indexB) {
                    return -1;
                }

                if (indexA > indexB) {
                    return 1;
                }

                return 0;
            });

        const resultElements = results.slice(0, RESULT_MAX_ITEMS - 1).map((result, index) => {
            return createSearchResult(result, value, index);
        });

        const HAS_RESULT = resultElements.length > 0;

        if (HAS_RESULT) {
            resultElements.forEach((element) => searchResultsBox.appendChild(element));

            const recycledResultFocusIndex = results.findIndex(
                ({ short_name }) => short_name === focusName,
            );

            if (recycledResultFocusIndex > -1 && recycledResultFocusIndex <= focusIndex) {
                setFocusResult(recycledResultFocusIndex);
            } else {
                setFocusResult(0);
            }
        }

        if (!HAS_RESULT) {
            const noResultElement = createNoResult();
            searchResultsBox.appendChild(noResultElement);
        }

        searchResultsBox.classList.remove('hidden');
    }

    if (value.length === 0) {
        searchResultsBox.classList.add('hidden');
    }
};

export const handleSearchKeys = (event: KeyboardEvent, searchResultsBox: HTMLElement): void => {
    const { key } = event;

    if (key === 'ArrowDown') {
        event.preventDefault();
        const { focusIndex } = getCurrentFocusResult();

        const maxResultIndex = searchResultsBox.children.length - 1;

        if (focusIndex < maxResultIndex) {
            unSetFocusResult(focusIndex);
            setFocusResult(focusIndex + 1);
        }

        if (focusIndex === maxResultIndex) {
            unSetFocusResult(focusIndex);
            setFocusResult(0);
        }
    }

    if (key === 'ArrowUp') {
        event.preventDefault();
        const { focusIndex } = getCurrentFocusResult();

        const maxResultIndex = searchResultsBox.children.length - 1;

        if (focusIndex > 0) {
            unSetFocusResult(focusIndex);
            setFocusResult(focusIndex - 1);
        }

        if (focusIndex === 0) {
            unSetFocusResult(focusIndex);
            setFocusResult(maxResultIndex);
        }
    }

    if (key === 'Enter') {
        event.preventDefault();
        const { focusHref } = getCurrentFocusResult();

        window.location.href = focusHref;
    }

    if (key === 'Tab') {
        const { focusIndex } = getCurrentFocusResult();
        unSetFocusResult(focusIndex);
    }
};
