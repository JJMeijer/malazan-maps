const generateLink = (short_name, type) => {
  return `/${type}/${short_name}`;
};
const partialBoldString = (fullText, boldText) => {
  return fullText.replace(new RegExp(boldText, "gi"), `<span class="font-extrabold text-white">${boldText}</span>`);
};
const wrapperClassList = ["flex", "flex-col", "p-2", "text-md"];
const linkClassList = ["flex", "flex-row"];
const nameClassList = ["w-1/2", "text-gray-200"];
const typeClassList = ["w-1/2", "text-gray-200", "opacity-50", "text-right"];
const createSearchResult = (name, short_name, type, query) => {
  const resultWrapper = document.createElement("div");
  resultWrapper.classList.add(...wrapperClassList);
  const resultLink = document.createElement("a");
  resultLink.href = generateLink(short_name, type);
  resultLink.classList.add(...linkClassList);
  const resultName = document.createElement("p");
  resultName.innerHTML = partialBoldString(name, query);
  resultName.classList.add(...nameClassList);
  const resultType = document.createElement("p");
  resultType.innerHTML = type;
  resultType.classList.add(...typeClassList);
  resultLink.appendChild(resultName);
  resultLink.appendChild(resultType);
  resultWrapper.appendChild(resultLink);
  return resultWrapper;
};
const createNoResult = () => {
  const wrapper = document.createElement("div");
  wrapper.classList.add(...["p-2", "text-md", "text-gray-200", "w-full"]);
  const text = document.createElement("p");
  text.innerHTML = "No Results";
  wrapper.appendChild(text);
  return wrapper;
};
const handleSearch = (event, searchResultsBox) => {
  searchResultsBox.innerHTML = "";
  const { entries } = window.malazan;
  const { value } = event.target;
  if (value.length > 0) {
    const results = entries.filter(({ name }) => {
      return name.match(new RegExp(value, "i"));
    });
    const resultElements = results.map((result) => {
      const { name, short_name, type } = result;
      return createSearchResult(name, short_name, type, value);
    });
    if (resultElements.length > 0) {
      resultElements.forEach((element) => searchResultsBox.appendChild(element));
    } else {
      const noResultElement = createNoResult();
      searchResultsBox.appendChild(noResultElement);
    }
    if (searchResultsBox.classList.contains("hidden")) {
      searchResultsBox.classList.remove("hidden");
    }
  }
};
document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("search");
  const searchResultsBox = document.getElementById("search-results");
  if (searchBox instanceof HTMLInputElement && searchResultsBox instanceof HTMLDivElement) {
    searchBox.addEventListener("input", (event) => handleSearch(event, searchResultsBox));
    searchBox.addEventListener("focus", (event) => handleSearch(event, searchResultsBox));
    document.addEventListener("focusin", (event) => {
      const target = event.target;
      if (!target.matches("#search, #search-results, #search-results *")) {
        searchResultsBox.classList.add("hidden");
      }
    });
  }
});
//# sourceMappingURL=base.js.map
