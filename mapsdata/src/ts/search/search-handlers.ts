import { fuse } from './fuse-search';
import {
    getSearchResultsElement,
    getCurrentFocusResult,
    createSearchResult,
    createNoResult,
    setFocusResult,
    unSetFocusResult,
} from './element-helpers';

export const handleSearchInput = (event: Event): void => {
    const searchResultsElement = getSearchResultsElement();

    if (!(event.target instanceof HTMLInputElement)) {
        throw new Error('Unexpected target of search input event.');
    }

    const { value } = event.target;
    const { focusName, focusIndex } = getCurrentFocusResult();

    searchResultsElement.innerHTML = '';

    if (value.length > 0) {
        const results = fuse.search(value);

        const resultElements = results.slice(0, 9).map((result, index) => {
            const { item, matches } = result;

            if (matches) {
                const nameMatch = matches.find((match) => match.key === 'name');

                if (nameMatch) {
                    const { indices } = nameMatch;
                    return createSearchResult(item, indices, index);
                }
            }

            throw new Error('"matches" object has unexpected content');
        });

        const HAS_RESULT = resultElements.length > 0;

        if (HAS_RESULT) {
            resultElements.forEach((element) => searchResultsElement.appendChild(element));

            const recycledResultFocusIndex = results.findIndex(
                ({ item: { short_name } }) => short_name === focusName,
            );

            if (recycledResultFocusIndex > -1 && recycledResultFocusIndex <= focusIndex) {
                setFocusResult(recycledResultFocusIndex);
            } else {
                setFocusResult(0);
            }
        }

        if (!HAS_RESULT) {
            const noResultElement = createNoResult();
            searchResultsElement.appendChild(noResultElement);
        }

        searchResultsElement.classList.remove('hidden');
    }

    if (value.length === 0) {
        searchResultsElement.classList.add('hidden');
    }
};

export const handleSearchKeys = (event: KeyboardEvent): void => {
    const searchResultsElement = getSearchResultsElement();

    const { key } = event;

    if (key === 'ArrowDown') {
        event.preventDefault();
        const { focusIndex } = getCurrentFocusResult();

        const maxResultIndex = searchResultsElement.children.length - 1;

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

        const maxResultIndex = searchResultsElement.children.length - 1;

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
