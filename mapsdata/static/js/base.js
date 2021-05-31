(() => {
  // static/ts/search/constants.ts
  var RESULT_INDEX_ATTRIBUTE = "index";
  var RESULT_NAME_ATTRIBUTE = "name";
  var RESULT_HREF_ATTRIBUTE = "href";

  // static/ts/search/result-element.ts
  var generateLink = (short_name, type) => {
    if (type === "book") {
      return `/book/${short_name}`;
    }
    return `/place/${short_name}`;
  };
  var partialBoldString = (fullText, boldText) => {
    return fullText.replace(new RegExp(`(${boldText})`, "gi"), `<span class="font-extrabold text-gray-800">$1</span>`);
  };
  var createSearchResult = (resultData, query, index) => {
    const { name, short_name, type } = resultData;
    const resultHref = generateLink(short_name, type);
    const resultWrapper = document.createElement("div");
    resultWrapper.classList.add("flex", "flex-col", "p-2", "text-md", "hover:bg-gray-200");
    resultWrapper.setAttribute(`data-${RESULT_INDEX_ATTRIBUTE}`, String(index));
    resultWrapper.setAttribute(`data-${RESULT_NAME_ATTRIBUTE}`, short_name);
    resultWrapper.setAttribute(`data-${RESULT_HREF_ATTRIBUTE}`, resultHref);
    const resultLink = document.createElement("a");
    resultLink.href = resultHref;
    resultLink.classList.add("flex", "flex-row");
    const resultName = document.createElement("p");
    resultName.innerHTML = partialBoldString(name, query);
    resultName.classList.add("w-3/4");
    const resultType = document.createElement("p");
    resultType.innerHTML = type;
    resultType.classList.add("w-1/4", "opacity-50", "text-right");
    resultLink.appendChild(resultName);
    resultLink.appendChild(resultType);
    resultWrapper.appendChild(resultLink);
    return resultWrapper;
  };
  var createNoResult = () => {
    const wrapper = document.createElement("div");
    wrapper.classList.add(...["p-2", "text-md", "w-full"]);
    const text = document.createElement("p");
    text.innerHTML = "No Results";
    wrapper.appendChild(text);
    return wrapper;
  };

  // static/ts/search/result-focus.ts
  var FOCUS_RESULT_CLASS = "focus-result";
  var FOCUS_CLASSES = [FOCUS_RESULT_CLASS, "bg-gray-200", "text-gray-800"];
  var getCurrentFocusResult = () => {
    const element = document.querySelector(`.${FOCUS_RESULT_CLASS}`);
    if (element instanceof HTMLElement) {
      const focusIndex = element.dataset[RESULT_INDEX_ATTRIBUTE];
      const focusName = element.dataset[RESULT_NAME_ATTRIBUTE];
      const focusHref = element.dataset[RESULT_HREF_ATTRIBUTE];
      if (focusName && focusIndex && focusHref) {
        return {
          focusName,
          focusIndex: parseInt(focusIndex),
          focusHref
        };
      }
      throw new Error("Focussed Result had unexpected format");
    }
    return {
      focusName: "",
      focusIndex: 0,
      focusHref: ""
    };
  };
  var unSetFocusResult = (resultIndex) => {
    const element = document.querySelector(`[data-index="${resultIndex}"]`);
    if (element !== null) {
      element.classList.remove(...FOCUS_CLASSES);
    }
  };
  var setFocusResult = (resultIndex) => {
    const element = document.querySelector(`[data-index="${resultIndex}"]`);
    if (element !== null) {
      element.classList.add(...FOCUS_CLASSES);
    }
  };

  // static/ts/search/search.ts
  var handleSearchInput = (event, searchResultsBox) => {
    if (!(event.target instanceof HTMLInputElement)) {
      throw new Error("Unexpected target of search input event.");
    }
    const { value } = event.target;
    const { focusName } = getCurrentFocusResult();
    const { entries } = window.malazan;
    searchResultsBox.innerHTML = "";
    if (value.length > 0) {
      const results = entries.filter(({ name }) => {
        return name.match(new RegExp(value, "i"));
      });
      const resultElements = results.slice(0, 9).map((result, index) => {
        return createSearchResult(result, value, index);
      });
      const HAS_RESULT = resultElements.length > 0;
      if (HAS_RESULT) {
        resultElements.forEach((element) => searchResultsBox.appendChild(element));
        const recycledResultFocusIndex = results.findIndex(({ short_name }) => short_name === focusName);
        if (recycledResultFocusIndex > -1) {
          setFocusResult(recycledResultFocusIndex);
        }
        if (recycledResultFocusIndex === -1) {
          setFocusResult(0);
        }
      }
      if (!HAS_RESULT) {
        const noResultElement = createNoResult();
        searchResultsBox.appendChild(noResultElement);
      }
      searchResultsBox.classList.remove("hidden");
    }
    if (value.length === 0) {
      searchResultsBox.classList.add("hidden");
    }
  };
  var handleSearchKeys = (event, searchResultsBox) => {
    const { key } = event;
    if (key === "ArrowDown") {
      event.preventDefault();
      const { focusIndex } = getCurrentFocusResult();
      const maxResultIndex = searchResultsBox.children.length - 1;
      if (focusIndex < maxResultIndex) {
        unSetFocusResult(focusIndex);
        setFocusResult(focusIndex + 1);
      }
      if (focusIndex === maxResultIndex) {
        unSetFocusResult(focusIndex);
        setFocusResult(0);
      }
    }
    if (key === "ArrowUp") {
      event.preventDefault();
      const { focusIndex } = getCurrentFocusResult();
      const maxResultIndex = searchResultsBox.children.length - 1;
      if (focusIndex > 0) {
        unSetFocusResult(focusIndex);
        setFocusResult(focusIndex - 1);
      }
      if (focusIndex === 0) {
        unSetFocusResult(focusIndex);
        setFocusResult(maxResultIndex);
      }
    }
    if (key === "Enter") {
      event.preventDefault();
      const { focusHref } = getCurrentFocusResult();
      window.location.href = focusHref;
    }
    if (key === "Tab") {
      const { focusIndex } = getCurrentFocusResult();
      unSetFocusResult(focusIndex);
    }
  };

  // static/ts/base.ts
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
})();
//# sourceMappingURL=base.js.map
