import {
    getSearchInputElement,
    getSearchResultsElement,
    getSearchWrapperElement,
} from './search/element-helpers';
import { handleSearchInput, handleSearchKeys } from './search/search-handlers';
import { fuse, setSearchEntries } from './search/fuse-search';

// Register serviceworker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}

setSearchEntries(fuse);

const searchInit = () => {
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
};

if (document.readyState !== 'loading') {
    searchInit();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        searchInit();
    });
}
