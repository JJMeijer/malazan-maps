import { Entry } from "../../types";
import { safeGetElementById } from "./safe-get-element-by-id";
import Fuse from "fuse.js";

export const showSearchResults = (): void => {
    const searchResultsElement = safeGetElementById("search-results");
    searchResultsElement.classList.remove("hidden");
};

export const hideSearchResults = (): void => {
    const searchResultsElement = safeGetElementById("search-results");
    searchResultsElement.classList.add("hidden");
};

export const clearSearchResults = (): void => {
    const searchResultsElement = safeGetElementById("search-results");
    searchResultsElement.innerHTML = "";
};

export const createNoResultElement = (): void => {
    const searchResultsElement = safeGetElementById("search-results");
    searchResultsElement.insertAdjacentHTML(
        "beforeend",
        `<div class="p-2 w-full"><p>No Results</p></div>`,
    );
};

const boldIndices = (name: string, indices: readonly Fuse.RangeTuple[]): string => {
    let result = "";
    let position = 0;
    indices.forEach(([from, to], index) => {
        result += name.substring(position, from);
        position = to + 1;

        const replaceTarget = name.substring(from, to + 1);
        const replacement = `<span class="text-gray-800 font-bold">${replaceTarget}</span>`;

        result += replacement;

        if (index === indices.length - 1) {
            result += name.substring(to + 1, name.length);
        }
    });

    return result;
};

export const createSearchResult = (item: Entry, indices: readonly Fuse.RangeTuple[]): string => {
    const { name, slug, type } = item;
    const resultHref = `/${type}/${slug}/`;
    const resultLinkClasses =
        "flex flex-col p-2 hover:bg-gray-300 cursor-pointer focus-visible:bg-gray-200 focus-visible:text-gray-800";

    const nameElement = `<p class="w-3/4">${boldIndices(name, indices)}</p>`;
    const typeElement = `<p class="w-1/4 opacity-50 text-right">${type}</p>`;
    const resultWrapper = `<div class="flex flex-row">${nameElement}${typeElement}</div>`;

    return `<a href="${resultHref}" tabindex="0" class="${resultLinkClasses}">${resultWrapper}</a>`;
};

export const insertSearchResults = (searchResultsHtml: string): void => {
    const searchResultsElement = safeGetElementById("search-results");

    searchResultsElement.insertAdjacentHTML("beforeend", searchResultsHtml);
};

const FOCUSSED_RESULT = "focussed-result";
const FOCUS_CLASSES = [FOCUSSED_RESULT, "bg-gray-200", "text-gray-800"];

export const getFocussedResultIndex = (): number => {
    const { children } = safeGetElementById("search-results");

    if (children.length === 0) {
        return -1;
    }

    for (let i = 0; i < children.length; i++) {
        if (children[i]) {
            const element = children[i] as HTMLElement;
            if (element.classList.contains(FOCUSSED_RESULT)) {
                return i;
            }
        }
    }

    throw new Error("Focussed Result index is missing");
};

export const getFocussedResultHref = (): string => {
    const { children } = safeGetElementById("search-results");

    for (let i = 0; i < children.length; i++) {
        if (children[i]) {
            const element = children[i] as HTMLElement;
            if (element.classList.contains(FOCUSSED_RESULT)) {
                const href = element.getAttribute("href");
                if (typeof href === "string") {
                    return href;
                }
            }
        }
    }

    throw new Error("Focussed Result href is missing");
};

export const unSetFocussedResult = (resultIndex: number): void => {
    const {
        children: { [resultIndex]: searchResult },
    } = safeGetElementById("search-results");

    if (searchResult) {
        searchResult.classList.remove(...FOCUS_CLASSES);
    }
};

export const setFocussedResult = (resultIndex: number): void => {
    const { children } = safeGetElementById("search-results");
    const lastIndex = children.length - 1;

    if (resultIndex > lastIndex) {
        const element = children[0] as HTMLElement;
        element.classList.add(...FOCUS_CLASSES);
        return;
    }

    if (resultIndex < 0) {
        const element = children[lastIndex] as HTMLElement;
        element.classList.add(...FOCUS_CLASSES);
        return;
    }

    const element = children[resultIndex] as HTMLElement;
    element.classList.add(...FOCUS_CLASSES);
};

export const resetSearchInput = (): void => {
    const searchInputElement = safeGetElementById("search") as HTMLInputElement;
    searchInputElement.value = "";
    searchInputElement.focus();
};
