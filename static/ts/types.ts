export interface Entry {
    name: string;
    short_name: string;
    type: 'city' | 'region' | 'continent' | 'book';
}

interface MarkerData {
    name: string;
    short_name: string;
    description: string;
    type: 'city' | 'region';
}

interface CityMarker {
    city: MarkerData;
    x: number;
    y: number;
}

interface RegionMarker {
    region: MarkerData;
    x: number;
    y: number;
}

export type Marker = CityMarker | RegionMarker;
