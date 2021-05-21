import { createSearchResult, createNoResult } from './result-element';
import { getCurrentFocusResult, setFocusResult, unSetFocusResult } from './result-focus';

export const handleSearchInput = (event: Event, searchResultsBox: HTMLElement): void => {
    if (!(event.target instanceof HTMLInputElement)) {
        throw new Error('Unexpected target of search input event.');
    }

    const { value } = event.target;
    const { focusName } = getCurrentFocusResult();
    const { entries } = window.malazan;

    searchResultsBox.innerHTML = '';

    if (value.length > 0) {
        const results = entries.filter(({ name }) => {
            return name.match(new RegExp(value, 'i'));
        });

        const resultElements = results.map((result, index) => {
            return createSearchResult(result, value, index);
        });

        const HAS_RESULT = resultElements.length > 0;

        if (HAS_RESULT) {
            resultElements.forEach((element) => searchResultsBox.appendChild(element));

            const recycledResulFocusIndex = results.findIndex(
                ({ short_name }) => short_name === focusName,
            );

            if (recycledResulFocusIndex > -1) {
                setFocusResult(recycledResulFocusIndex);
            }

            if (recycledResulFocusIndex === -1) {
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

        if (focusIndex < searchResultsBox.children.length - 1) {
            unSetFocusResult(focusIndex);
            setFocusResult(focusIndex + 1);
        }
    }

    if (key === 'ArrowUp') {
        event.preventDefault();
        const { focusIndex } = getCurrentFocusResult();

        if (focusIndex > 0) {
            unSetFocusResult(focusIndex);
            setFocusResult(focusIndex - 1);
        }
    }

    if (key === 'Enter') {
        event.preventDefault();
        const { focusHref } = getCurrentFocusResult();

        window.location.href = focusHref;
    }
};
