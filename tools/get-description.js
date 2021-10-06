const prompts = require('prompts');
const { wikiSearch, wikiSummary } = require('./wiki');

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
