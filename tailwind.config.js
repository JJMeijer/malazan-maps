/* eslint-env node */

const plugin = require('tailwindcss/plugin');

module.exports = {
    purge: ['./mapsdata/templates/**/*.html', './mapsdata/static/js/*.js'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                primary: '#082915',
            },
        },
    },
    variants: {
        extend: {
            backgroundColor: ['label-checked'],
            borderWidth: ['label-checked'],
        },
    },
    plugins: [
        plugin(({ addVariant, e }) => {
            addVariant('label-checked', ({ modifySelectors, separator }) => {
                modifySelectors(({ className }) => {
                    const eClassName = e(`label-checked${separator}${className}`); // escape class
                    const yourSelector = 'input[type="radio"]'; // your input selector. Could be any
                    return `${yourSelector}:checked ~ .${eClassName}`; // ~ - CSS selector for siblings
                });
            });
        }),
    ],
};
