import Fuse from 'fuse.js';
import { Entry } from '../../types';
import {
    clearSearchResults,
    createNoResultElement,
    createSearchResult,
    hideSearchResults,
    insertSearchResults,
    setFocussedResult,
    showSearchResults,
} from '../helpers';

const fuse: Fuse<Entry> = new Fuse([], {
    includeMatches: true,
    keys: ['name'],
});

(async () => {
    const resp = await fetch('/data.json');
    const data = await resp.json();
    fuse.setCollection(data);
})();

export const searchInputHandler = (event: Event): void => {
    clearSearchResults();

    /**
     * Manually assert that event.target is an HTMLInputElement. This means
     * that this code only works when the handler is used on an input element.
     * which sounds unlikely but it can technically fail.
     */
    const { value } = event.target as HTMLInputElement;

    // Search bar is empty
    if (value.length === 0) {
        hideSearchResults();
        return;
    }

    // Get Top 9 results with fuse search
    const results = fuse.search(value).slice(0, 9);

    // Search bar is not empty, but there are no results
    if (results.length === 0) {
        createNoResultElement();
        return;
    }

    const resultElementsHtml = results
        .map((result) => {
            const { item, matches } = result;

            if (!matches || !matches[0]) {
                throw new Error('Matching indices missing in fuse result object');
            }

            const indices = matches[0].indices;
            return createSearchResult(item, indices);
        })
        .join('');

    insertSearchResults(resultElementsHtml);
    showSearchResults();
    setFocussedResult(0);
};
