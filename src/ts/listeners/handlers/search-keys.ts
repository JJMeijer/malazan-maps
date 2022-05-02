import {
    getFocussedResultIndex,
    getFocussedResultHref,
    unSetFocussedResult,
    setFocussedResult,
} from "../helpers";

export const searchKeysHandler = (event: KeyboardEvent): void => {
    const { key } = event;

    if (key === "ArrowDown") {
        event.preventDefault();
        const focusIndex = getFocussedResultIndex();

        unSetFocussedResult(focusIndex);
        setFocussedResult(focusIndex + 1);
    }

    if (key === "ArrowUp") {
        event.preventDefault();
        const focusIndex = getFocussedResultIndex();

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
        unSetFocussedResult(focusIndex);
    }
};
