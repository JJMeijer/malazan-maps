const { default: axios } = require('axios');
const { parse } = require('node-html-parser');

const BASE_URL = 'https://malazan.fandom.com/api.php';

const wikiSearch = async (term) => {
    const encodedTerm = encodeURIComponent(term);
    const qs = `?action=query&list=search&srsearch=${encodedTerm}&utf8=&format=json`;
    const url = `${BASE_URL}${qs}`;

    const {
        data: {
            query: { search },
        },
    } = await axios.get(url);

    return search.map((item) => ({
        title: item.title,
        value: item.title,
    }));
};

const wikiUrl = async (title) => {
    const encodedTitle = encodeURIComponent(title);
    const qs = `?action=query&titles=${encodedTitle}&prop=info&inprop=url&formatversion=2&format=json`;
    const url = `${BASE_URL}${qs}`;
    const response = await axios.get(url);

    const {
        data: {
            query: {
                pages: [{ fullurl }],
            },
        },
    } = response;

    return fullurl;
};

const wikiParse = async (title) => {
    const encodedTitle = encodeURIComponent(title);
    const qs = `?action=parse&page=${encodedTitle}&prop=text&formatversion=2&format=json`;
    const url = `${BASE_URL}${qs}`;
    const response = await axios.get(url);

    const {
        data: {
            parse: { text },
        },
    } = await response;

    return text;
};

const wikiFirstParagraph = (text) => {
    const root = parse(text);
    const paragraphs = root.querySelectorAll('.mw-parser-output > p');

    for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];

        if (paragraph.querySelector('aside')) {
            continue;
        }

        if (paragraph.querySelector('span.slug')) {
            continue;
        }

        if (paragraph.classList.contains('mw-empty-elt')) {
            continue;
        }

        if (paragraph.classList.contains('slug')) {
            continue;
        }

        return paragraph.text;
    }
};

const wikiSummary = async (title) => {
    const pageText = await wikiParse(title);
    const firstParagraph = wikiFirstParagraph(pageText);
    const cleanedText = firstParagraph
        .trim()
        .replace(/\[\d+\]/g, '')
        .replace(/\s{2,}/g, ' ');

    return cleanedText;
};

module.exports = {
    wikiSearch,
    wikiSummary,
    wikiUrl,
};
