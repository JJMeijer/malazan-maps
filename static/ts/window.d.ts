export {};

declare global {
    interface Window {
        malazan: {
            entries: Array<{
                name: string;
                short_name: string;
                type: 'city' | 'region' | 'continent' | 'book';
            }>;
        };
    }
}
