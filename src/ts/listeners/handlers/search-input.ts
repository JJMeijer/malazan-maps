import Fuse from "fuse.js";
import { Entry } from "../../types";
import {
    clearSearchResults,
    createNoResultElement,
    createSearchResult,
    hideSearchResults,
    insertSearchResults,
    setFocussedResult,
    showSearchResults,
} from "../helpers";

const fuse: Fuse<Entry> = new Fuse([], {
    includeMatches: true,
    keys: ["name", "type"],
});

(async () => {
    const resp = await fetch("/data.json");
    const data = await resp.json();
    fuse.setCollection(data);
})();

let previousInput = "";

export const searchInputHandler = (event: Event): void => {
    /**
     * Manually assert that event.target is an HTMLInputElement. This means
     * that this code only works when the handler is used on an input element.
     * which sounds unlikely but it can technically fail.
     */
    const { value } = event.target as HTMLInputElement;

    /**
     * For some God forsaken reason Firefox Mobile (sometimes) emits an input event when
     * Clicking on a search result. This means that below `clearSearchResults` is run and
     * the click doesn't register because the clicked element doesn't exist anymore.
     * To circumvent this we ignore input events that did not effect the content of the
     * search field value.
     */
    if (value === previousInput && event.type == "input") {
        return;
    }

    previousInput = value;

    clearSearchResults();

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
        showSearchResults();
        return;
    }

    const resultElementsHtml = results
        .map((result) => {
            const { item, matches } = result;

            if (!matches || !matches[0]) {
                throw new Error("Matching indices missing in fuse result object");
            }

            const indices = matches[0].indices;
            return createSearchResult(item, indices);
        })
        .join("");

    insertSearchResults(resultElementsHtml);
    showSearchResults();
    setFocussedResult(0);
};
