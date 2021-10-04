import Fuse from 'fuse.js';

import { Entry } from '../types';

const fuseOptions = {
    includeMatches: true,
    keys: ['name'],
};

export const fuse: Fuse<Entry> = new Fuse([], fuseOptions);

export const setSearchEntries = async (fuse: Fuse<Entry>): Promise<void> => {
    const resp = await fetch(`/data.json?v=${new Date().getTime()}`);
    const data = await resp.json();

    fuse.setCollection(data);
};
