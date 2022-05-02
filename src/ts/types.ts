export interface FocusResultInformation {
    focusName: string;
    focusIndex: number;
    focusHref: string;
}

interface MapData {
    name: string;
    image: string;
    marker?: {
        x: number;
        y: number;
    };
}

export interface Entry {
    name: string;
    slug: string;
    type: "city" | "region" | "continent" | "book";
    description: string;
    wikiLink: string;
    maps: MapData[];
}

export interface NaturalDimensions {
    naturalWidth: number;
    naturalHeight: number;
}

export interface RealDimensions {
    width: number;
    height: number;
    top: number;
    left: number;
}

export interface ElementPaddings {
    rightPadding: number;
    bottomPadding: number;
    leftPadding: number;
    topPadding: number;
}
