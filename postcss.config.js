/* eslint-env node */
module.exports = {
    plugins: [
        require('postcss-import'),
        require('stylelint'),
        require('autoprefixer'),
        require('postcss-minify'),
    ],
};
