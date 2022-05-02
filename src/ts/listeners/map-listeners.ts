import { setVisibleMapTransformOrigin, placeVisibleMarker } from "./helpers";
import { setMapSelectorListeners, setZoomAndPanListeners } from "./handlers";

const setListeners = (): void => {
    setVisibleMapTransformOrigin();
    setZoomAndPanListeners();
    setMapSelectorListeners();
    placeVisibleMarker();

    window.addEventListener("resize", () => {
        placeVisibleMarker();
    });
};

export const setMapListeners = (): void => {
    const visibleImage = document.querySelector(
        '[id^="map-imagewrapper-"]:not(.hidden) [id^="map-image-"',
    );

    /**
     * Don't continue when no image element is on page
     */
    if (!(visibleImage instanceof HTMLImageElement)) {
        return;
    }

    /**
     * If image is already completely loaded set the listeners. Else
     * wait for it to load. This is necessary because the listener code needs
     * the correct dimensions of the image.
     */
    if (visibleImage.complete) {
        setListeners();
        return;
    }

    visibleImage.addEventListener("load", () => {
        setListeners();
    });
};
