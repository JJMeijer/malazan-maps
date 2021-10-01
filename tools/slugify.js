/* eslint-env node */

const slugify = require('@sindresorhus/slugify');
require('colors');

const args = process.argv.slice(2);

const slugs = args.map((arg) =>
    slugify('' + arg, {
        decamelize: false,
        customReplacements: [["'", '']],
    }),
);

console.clear();
console.log('Input:'.bold.underline);
console.log(`${args.join('\n')}\n`);

console.log('Output:'.bold.underline);
console.log(`${slugs.join('\n')}\n`);
