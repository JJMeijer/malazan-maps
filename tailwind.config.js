module.exports = {
    mode: 'jit',
    purge: ['./views/_includes/**/*.njk', './src/ts/**/*.ts'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                primary: '#082915',
            },
            cursor: {
                grab: 'grab',
                grabbing: 'grabbing',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
