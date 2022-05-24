export interface FocusResultInformation {
    focusName: string;
    focusIndex: number;
    focusHref: string;
}

export interface Entry {
    name: string;
    slug: string;
    type: "city" | "region" | "continent" | "book" | "map";
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
