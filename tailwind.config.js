module.exports = {
    content: ["./views/_includes/**/*.njk", "./src/ts/**/*.ts"],
    theme: {
        extend: {
            colors: {
                primary: "#082915",
            },
            cursor: {
                grab: "grab",
                grabbing: "grabbing",
            },
        },
    },
    plugins: [],
};
