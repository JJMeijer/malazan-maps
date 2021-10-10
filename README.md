# Malazan Maps

Search engine for maps & locations in the Malazan world by Steven Erikson & Ian Cameron Esslemont. Intended as a reading companion to quickly find a location mentioned in one of the books.

## Adding/Update new locations

The data for all locations can be found in [content.json](./views/_data/content.json). When updating the data it's fine to directly change the json, but for adding new locations I'd advise to use the `add-data` prompt because this automatically adds the correct wiki URL and fetches the first paragraph of the Wiki page.

```bash
yarn add-data
# npm run add-data
```
