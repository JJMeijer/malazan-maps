import { setVisibleMapTransformOrigin } from "../helpers";
import { placeVisibleMarker } from "../helpers";

const handleMapSelectorChange = (selectedIndex: number) => {
    const mapWrappers = document.querySelectorAll("[id^=map-imagewrapper-]");

    // Hide all maps
    mapWrappers.forEach((mapWrapper) => {
        if (!mapWrapper.classList.contains("hidden")) {
            mapWrapper.classList.add("hidden");
        }
    });

    const selectedImageWrapper = document.getElementById(`map-imagewrapper-${selectedIndex}`);
    if (!(selectedImageWrapper instanceof HTMLElement)) {
        throw new Error("Imagewrapper for selected map is missing");
    }

    selectedImageWrapper.classList.remove("hidden");

    const selectedImage = selectedImageWrapper.querySelector(".map-image");
    if (!(selectedImage instanceof HTMLImageElement)) {
        throw new Error("Image for selected map is missing");
    }

    /**
     * Because map images are lazy-loaded it's possible we need to wait
     * for the image to be there before the transform-origin is set and the marker is placed
     */
    if (selectedImage.complete) {
        setVisibleMapTransformOrigin();
        placeVisibleMarker();
    } else {
        selectedImage.addEventListener("load", () => {
            setVisibleMapTransformOrigin();
            placeVisibleMarker();
        });
    }
};

export const setMapSelectorListeners = (): void => {
    const mapSelector = document.getElementById("map-selector");

    if (!(mapSelector instanceof HTMLSelectElement)) {
        return;
    }

    mapSelector.addEventListener("change", () => {
        const { selectedIndex } = mapSelector;
        handleMapSelectorChange(selectedIndex);
    });
};
