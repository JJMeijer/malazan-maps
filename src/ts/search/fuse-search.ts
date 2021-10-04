import Fuse from 'fuse.js';

import { Entry } from '../types';

const fuseOptions = {
    includeMatches: true,
    keys: ['name'],
};

export const fuse: Fuse<Entry> = new Fuse([], fuseOptions);

export const setSearchEntries = async (fuse: Fuse<Entry>): Promise<void> => {
    const resp = await fetch('/data.json');
    const data = await resp.json();
    console.log('hi');

    fuse.setCollection(data);
};
