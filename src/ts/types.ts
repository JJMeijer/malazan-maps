export interface ResultData {
    name: string;
    shortName: string;
    type: string;
}

export interface FocusResultInformation {
    focusName: string;
    focusIndex: number;
    focusHref: string;
}

export interface Entry {
    name: string;
    shortName: string;
    type: 'city' | 'region' | 'continent' | 'book';
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
