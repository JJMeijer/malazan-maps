import { setVisibleMapTransformOrigin } from "../helpers";
import { extractMapId } from "../helpers";
import { placeVisibleMarker } from "../helpers";

const handleMapSelectorChange = (event: Event) => {
    const target = event.target as HTMLElement;
    const mapId = extractMapId(target.id);

    const mapWrappers = document.querySelectorAll("[id^=map-imagewrapper-]");

    // Hide all maps
    mapWrappers.forEach((mapWrapper) => {
        if (!mapWrapper.classList.contains("hidden")) {
            mapWrapper.classList.add("hidden");
        }
    });

    const selectedImageWrapper = document.getElementById(`map-imagewrapper-${mapId}`);
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
    const mapButtons = document.querySelectorAll('input[name="map-selector"]');
    const mapButtonSpans = document.querySelectorAll('input[name="map-selector"]~span');

    mapButtons.forEach((element) => {
        if (!(element instanceof HTMLInputElement)) {
            throw new Error("Map Input has unexpected type");
        }

        element.addEventListener("change", (event) => {
            handleMapSelectorChange(event);
        });
    });

    mapButtonSpans.forEach((element) => {
        if (!(element instanceof HTMLSpanElement)) {
            throw new Error("Map button has unexpected type");
        }

        element.addEventListener("keydown", (event) => {
            const { key } = event;

            if (key === "Enter") {
                const inputSibling = element.previousElementSibling;

                if (!(inputSibling instanceof HTMLInputElement)) {
                    throw new Error("Map Button input element missing");
                }

                inputSibling.checked = true;

                const changeEvent = new Event("change");
                inputSibling.dispatchEvent(changeEvent);
            }
        });
    });
};
