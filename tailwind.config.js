const plugin = require('tailwindcss/plugin');

module.exports = {
  // mode: 'jit',
  purge: [
    '../**/templates/*.html',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      serif: ['Merriweather', 'ui-serif', 'Georgia', 'Cambria'],
    },
    extend: {},
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
        modifySelectors(
          ({ className }) => {
            const eClassName = e(`label-checked${separator}${className}`); // escape class
            const yourSelector = 'input[type="radio"]'; // your input selector. Could be any
            return `${yourSelector}:checked ~ .${eClassName}`; // ~ - CSS selector for siblings
          },
        );
      });
    }),
  ],
};
