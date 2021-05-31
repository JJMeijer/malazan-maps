import { Entry, Marker } from './types';

declare global {
    interface Window {
        malazan: {
            entries: Entry[];
            markers: Marker[];
        };
    }
}
