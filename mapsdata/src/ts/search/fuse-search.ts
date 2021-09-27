import Fuse from 'fuse.js';

import { Entry } from '../types';

const fuseOptions = {
    includeMatches: true,
    keys: ['name'],
};

export const fuse: Fuse<Entry> = new Fuse([], fuseOptions);
