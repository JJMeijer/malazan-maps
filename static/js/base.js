(function wrapper() {
    const createSearchResult = (name, type, link) => {
        const resultWrapper = document.createElement('div');

        const resultLink = document.createElement('a');
        resultLink.href = link;

        const resultName = document.createElement('p');
        resultName.innerHTML = name;

        const resultType = document.createElement('p');
        resultType.innerHTML = type;

        resultLink.appendChild(resultName);
        resultLink.appendChild(resultType);
        resultWrapper.appendChild(resultLink);

        console.log(resultWrapper);
    };

    const setupSearch = () => {
        const searchResultsBox = document.getElementById('search-results');
        const searchBox = document.getElementById('search');

        searchBox.addEventListener('input', (event) => {
            //
        });
    };

    setupSearch();
}());
