module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 6,
    },
    rules: {
        indent: ['error', 4],
        'max-len': ['error', 125, 4],
        'no-param-reassign': ['error', { props: false }],
        'comma-dangle': ['error', {
            objects: 'always-multiline',
            arrays: 'always-multiline',
            functions: 'never',
        }],
    },
};
