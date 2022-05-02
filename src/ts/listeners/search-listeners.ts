import { searchInputHandler, searchKeysHandler, searchFocusoutHandler } from "./handlers";
import { safeGetElementById } from "./helpers";

export const setSearchListeners = (): void => {
    const searchInputElement = document.getElementById("search");

    /**
     * Don't continue when search element is not on page
     */
    if (!(searchInputElement instanceof HTMLElement)) {
        return;
    }

    searchInputElement.addEventListener("input", searchInputHandler);
    searchInputElement.addEventListener("focus", searchInputHandler);
    searchInputElement.addEventListener("keydown", searchKeysHandler);

    const searchWrapperElement = safeGetElementById("search-wrapper");
    searchWrapperElement.addEventListener("focusout", searchFocusoutHandler);
};
