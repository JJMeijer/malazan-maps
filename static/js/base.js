import { handleSearchInput, handleSearchKeys } from "./search/search";
document.addEventListener("DOMContentLoaded", () => {
  const searchBoxWrapper = document.getElementById("search-wrapper");
  const searchBox = document.getElementById("search");
  const searchResultsBox = document.getElementById("search-results");
  if (!(searchBoxWrapper instanceof HTMLElement)) {
    throw new Error("SearchboxWrapper is unexpectedly missing");
  }
  if (!(searchBox instanceof HTMLInputElement)) {
    throw new Error("Searchbox is unexpectedly missing");
  }
  if (!(searchResultsBox instanceof HTMLElement)) {
    throw new Error("SearchResultsBox is unexpectedly missing");
  }
  searchBox.addEventListener("input", (event) => handleSearchInput(event, searchResultsBox));
  searchBox.addEventListener("focus", (event) => handleSearchInput(event, searchResultsBox));
  searchBox.addEventListener("keydown", (event) => handleSearchKeys(event, searchResultsBox));
  searchBoxWrapper.addEventListener("focusout", (event) => {
    const relatedTarget = event.relatedTarget;
    if (relatedTarget === null) {
      searchResultsBox.classList.add("hidden");
    }
    if (relatedTarget instanceof HTMLElement && !relatedTarget.matches("#search-wrapper *")) {
      searchResultsBox.classList.add("hidden");
    }
  });
});
//# sourceMappingURL=base.js.map
