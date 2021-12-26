# Malazan Maps

Search engine for maps & locations in the Malazan world by Steven Erikson & Ian Cameron Esslemont. Intended as a reading companion to quickly find a location mentioned in one of the books.

## Tooling

- Static Site Generator: [Eleventy](https://www.11ty.dev/).
- JS: Typescript build with [Esbuild](https://esbuild.github.io/).
- CSS: [TailwindCSS](https://tailwindcss.com/).

## Setup

### Install dependencies

```bash
yarn install
# npm install
```

### Serve site locally

```bash
yarn serve
# npm run serve
```

## Adding/Update new locations

To add new locations use the [add-data](./tools/add-data.js) script. This script automatically adds the correct wiki URL and fetches the first paragraph of the Wiki page.

```bash
yarn add-data
# npm run add-data
```

It's also possible to update the [data file](./views/_data/content.json) directly. After changing the file use the [validate script](./tools/validate.js) to check if the data file still has the expected schema.

```bash
yarn validate
# npm run validate
```
