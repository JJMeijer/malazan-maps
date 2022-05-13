import {
    getFocussedResultIndex,
    getFocussedResultHref,
    unSetFocussedResult,
    setFocussedResult,
    resetSearchInput,
    clearSearchResults,
} from "../helpers";

export const searchKeysHandler = (event: KeyboardEvent): void => {
    const { key } = event;

    if (key === "ArrowDown") {
        event.preventDefault();
        const focusIndex = getFocussedResultIndex();
        if (focusIndex === -1) return;

        unSetFocussedResult(focusIndex);
        setFocussedResult(focusIndex + 1);
    }

    if (key === "ArrowUp") {
        event.preventDefault();
        const focusIndex = getFocussedResultIndex();
        if (focusIndex === -1) return;

        unSetFocussedResult(focusIndex);
        setFocussedResult(focusIndex - 1);
    }

    if (key === "Enter") {
        event.preventDefault();
        const focusHref = getFocussedResultHref();
        window.location.href = focusHref;
    }

    if (key === "Tab") {
        const focusIndex = getFocussedResultIndex();
        if (focusIndex === -1) return;
        unSetFocussedResult(focusIndex);
    }

    if (key === "Escape") {
        resetSearchInput();
        clearSearchResults();
    }
};
