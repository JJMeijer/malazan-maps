const generateLink = (short_name: string, type: string): string => {
    return `/${type}/${short_name}`;
};

const createSearchResult = (name: string, short_name: string, type: string) => {
    const resultWrapper = document.createElement('div');

    const resultLink = document.createElement('a');
    resultLink.href = generateLink(short_name, type);

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

    const { entries } = window.malazan;

    if (searchBox instanceof HTMLInputElement && searchResultsBox instanceof HTMLDivElement) {
        searchBox.addEventListener('input', (event) => {
            const { value } = event.target as HTMLInputElement;

            if (value.length > 2) {
                const results = entries.filter(({ name }) => {
                    return name.match(value);
                });

                console.log(results);
            }
        });
    }
};

setupSearch();