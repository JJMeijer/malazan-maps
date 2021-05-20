interface ResultData {
    name: string;
    short_name: string;
    type: string;
}

const focusClasses = ['focus-result', 'bg-gray-400', 'rounded-md'];

const generateLink = (short_name: string, type: string): string => {
    return `/${type}/${short_name}`;
};

const partialBoldString = (fullText: string, boldText: string): string => {
    return fullText.replace(
        new RegExp(`(${boldText})`, 'gi'),
        `<span class="font-extrabold text-white">$1</span>`,
    );
};

const getCurrentFocusResult = () => {
    const element = document.querySelector('.focus-result');

    if (element instanceof HTMLElement) {
        const focusResultIndex = element.dataset['index'];
        const focusResultName = element.dataset['name'];

        if (focusResultName && focusResultIndex) {
            return {
                focusResultName,
                focusResultIndex: parseInt(focusResultIndex),
            };
        }

        throw new Error('Focussed Result had unexpected format');
    }

    return {
        focusResultName: '',
        focusResultIndex: 0,
    };
};

const unSetFocusResult = (resultIndex: number) => {
    const element = document.querySelector(`[data-index="${resultIndex}"]`);

    if (element !== null) {
        element.classList.remove(...focusClasses);
    }
};

const setFocusResult = (resultIndex: number) => {
    const element = document.querySelector(`[data-index="${resultIndex}"]`);

    if (element !== null) {
        element.classList.add(...focusClasses);
    }
};

const createSearchResult = (resultData: ResultData, query: string, index: number) => {
    const { name, short_name, type } = resultData;

    const resultWrapper = document.createElement('div');
    resultWrapper.classList.add('flex', 'flex-col', 'p-2', 'text-md');
    resultWrapper.setAttribute('data-index', String(index));
    resultWrapper.setAttribute('data-name', short_name);

    const resultLink = document.createElement('a');
    resultLink.href = generateLink(short_name, type);
    resultLink.classList.add('flex', 'flex-row');

    const resultName = document.createElement('p');
    resultName.innerHTML = partialBoldString(name, query);
    resultName.classList.add('w-3/4', 'text-gray-200');

    const resultType = document.createElement('p');
    resultType.innerHTML = type;
    resultType.classList.add('w-1/4', 'text-gray-200', 'opacity-50', 'text-right');

    resultLink.appendChild(resultName);
    resultLink.appendChild(resultType);
    resultWrapper.appendChild(resultLink);

    return resultWrapper;
};

const createNoResult = (): HTMLElement => {
    const wrapper = document.createElement('div');
    wrapper.classList.add(...['p-2', 'text-md', 'text-gray-200', 'w-full']);

    const text = document.createElement('p');
    text.innerHTML = 'No Results';

    wrapper.appendChild(text);

    return wrapper;
};

const handleSearch = (event: Event, searchResultsBox: HTMLElement) => {
    if (!(event.target instanceof HTMLInputElement)) {
        throw new Error('Unexpected target of search input event.');
    }

    const { value } = event.target;
    const { focusResultName } = getCurrentFocusResult();
    const { entries } = window.malazan;

    searchResultsBox.innerHTML = '';

    if (value.length > 0) {
        const results = entries.filter(({ name }) => {
            return name.match(new RegExp(value, 'i'));
        });

        const resultElements = results.map((result, index) => {
            return createSearchResult(result, value, index);
        });

        const HAS_RESULT = resultElements.length > 0;

        if (HAS_RESULT) {
            resultElements.forEach((element) => searchResultsBox.appendChild(element));

            const recycledResulFocusIndex = results.findIndex(
                ({ short_name }) => short_name === focusResultName,
            );

            if (recycledResulFocusIndex > -1) {
                setFocusResult(recycledResulFocusIndex);
            }

            if (recycledResulFocusIndex === -1) {
                setFocusResult(0);
            }
        }

        if (!HAS_RESULT) {
            const noResultElement = createNoResult();
            searchResultsBox.appendChild(noResultElement);
        }

        searchResultsBox.classList.remove('hidden');
    }

    if (value.length === 0) {
        searchResultsBox.classList.add('hidden');
    }
};

const handleKeys = (event: KeyboardEvent, searchResultsBox: HTMLElement): void => {
    const { key } = event;

    if (key === 'ArrowDown') {
        const { focusResultIndex } = getCurrentFocusResult();

        if (focusResultIndex < searchResultsBox.children.length) {
            unSetFocusResult(focusResultIndex);
            setFocusResult(focusResultIndex + 1);
        }
    }

    if (key === 'ArrowUp') {
        const { focusResultIndex } = getCurrentFocusResult();

        if (focusResultIndex > 0) {
            unSetFocusResult(focusResultIndex);
            setFocusResult(focusResultIndex - 1);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.getElementById('search');
    const searchResultsBox = document.getElementById('search-results');

    if (searchBox instanceof HTMLInputElement && searchResultsBox instanceof HTMLDivElement) {
        searchBox.addEventListener('input', (event) => handleSearch(event, searchResultsBox));
        searchBox.addEventListener('focus', (event) => handleSearch(event, searchResultsBox));
        searchBox.addEventListener('keydown', (event) => handleKeys(event, searchResultsBox));

        document.addEventListener('focusin', (event) => {
            const target = event.target as HTMLElement;

            if (!target.matches('#search, #search-results, #search-results *')) {
                searchResultsBox.classList.add('hidden');
            }
        });
    }
});
