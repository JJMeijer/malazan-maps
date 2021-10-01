/* eslint-env node */
const prompts = require('prompts');
const { default: axios } = require('axios');
const { parse } = require('node-html-parser');

const BASE_URL = 'https://malazan.fandom.com/api.php';

const wikiSearch = async (term) => {
    const qs = `?action=query&list=search&srsearch=${encodeURIComponent(term)}&utf8=&format=json`;
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

const wikiParse = async (title) => {
    const queryString = `?action=parse&page=${title}&prop=text&formatversion=2&format=json`;
    const url = `${BASE_URL}${queryString}`;
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

(async () => {
    console.clear();
    try {
        const answers = await prompts([
            {
                type: 'text',
                name: 'search',
                message: 'Please enter a search term',
            },
            {
                type: 'select',
                name: 'result',
                message: 'Pick a result',
                choices: async (prev) => await wikiSearch(prev),
            },
        ]);

        const { result } = answers;
        const summary = await wikiSummary(result);

        console.log(`\n${summary}\n`);
    } catch (err) {
        console.log(err);
    }
})();
