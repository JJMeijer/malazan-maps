import { hideSearchResults } from '../helpers';

export const searchFocusoutHandler = (event: FocusEvent): void => {
    const relatedTarget = event.relatedTarget;
    if (relatedTarget === null) {
        hideSearchResults();
    }

    if (relatedTarget instanceof HTMLElement && !relatedTarget.matches('#search-wrapper *')) {
        hideSearchResults();
    }
};
