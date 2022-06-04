import { hideSearchResults } from "../helpers";

export const searchFocusoutHandler = (event: FocusEvent): void => {
    const { relatedTarget } = event;
    if (relatedTarget === null) {
        hideSearchResults();
        return;
    }

    if (relatedTarget instanceof HTMLElement && !relatedTarget.matches("#search-wrapper *")) {
        hideSearchResults();
        return;
    }
};
