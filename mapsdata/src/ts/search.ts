import {
    getSearchEntries,
    getSearchInputElement,
    getSearchResultsElement,
    getSearchWrapperElement,
} from './search/element-helpers';
import { handleSearchInput, handleSearchKeys } from './search/search-handlers';
import { fuse } from './search/fuse-search';

document.addEventListener('DOMContentLoaded', () => {
    fuse.setCollection(getSearchEntries());

    const searchWrapper = getSearchWrapperElement();
    const searchInput = getSearchInputElement();
    const searchResultsBox = getSearchResultsElement();

    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('focus', handleSearchInput);
    searchInput.addEventListener('keydown', handleSearchKeys);

    searchWrapper.addEventListener('focusout', (event) => {
        const relatedTarget = event.relatedTarget;
        if (relatedTarget === null) {
            searchResultsBox.classList.add('hidden');
        }

        if (relatedTarget instanceof HTMLElement && !relatedTarget.matches('#search-wrapper *')) {
            searchResultsBox.classList.add('hidden');
        }
    });
});
