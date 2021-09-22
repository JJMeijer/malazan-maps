import { RESULT_HREF_ATTRIBUTE, RESULT_INDEX_ATTRIBUTE, RESULT_NAME_ATTRIBUTE } from './constants';
import { ResultData } from './types';

const generateLink = (short_name: string, type: string): string => {
    if (type === 'book') {
        return `/books/${short_name}/`;
    }

    if (type === 'map') {
        return `/maps/${short_name}/`;
    }

    if (type !== 'region' && type !== 'city') {
        throw new Error('Unexpected search result type');
    }

    return `/places/${short_name}/`;
};

const partialBoldString = (fullText: string, boldText: string): string => {
    return fullText.replace(
        new RegExp(`(${boldText})`, 'gi'),
        `<span style="font-weight: 800; color: #1f2937;">$1</span>`,
    );
};

export const createSearchResult = (
    resultData: ResultData,
    query: string,
    index: number,
): HTMLElement => {
    const { name, short_name, type } = resultData;
    const resultHref = generateLink(short_name, type);

    const resultWrapper = document.createElement('div');
    resultWrapper.classList.add('search-result-wrapper');
    resultWrapper.setAttribute(`data-${RESULT_INDEX_ATTRIBUTE}`, String(index));
    resultWrapper.setAttribute(`data-${RESULT_NAME_ATTRIBUTE}`, short_name);
    resultWrapper.setAttribute(`data-${RESULT_HREF_ATTRIBUTE}`, resultHref);

    const resultLink = document.createElement('a');
    resultLink.href = resultHref;
    resultLink.classList.add('search-result-link');

    const resultName = document.createElement('p');
    resultName.innerHTML = partialBoldString(name, query);
    resultName.classList.add('search-result-name');

    const resultType = document.createElement('p');
    resultType.innerHTML = type;
    resultType.classList.add('search-result-type');

    resultLink.appendChild(resultName);
    resultLink.appendChild(resultType);
    resultWrapper.appendChild(resultLink);

    return resultWrapper;
};

export const createNoResult = (): HTMLElement => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('search-result-wrapper-noresult');

    const text = document.createElement('p');
    text.innerHTML = 'No Results';

    wrapper.appendChild(text);

    return wrapper;
};
