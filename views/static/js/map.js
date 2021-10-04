(() => {
  var __pow = Math.pow;

  // src/ts/mapview/element-helpers.ts
  var extractMapId = (elementIdString) => {
    const lastKebabCaseItem = elementIdString.split("-").slice(-1);
    if (lastKebabCaseItem[0]) {
      return lastKebabCaseItem[0];
    }
    throw new Error("Map ID not found");
  };
  var getVisibleImage = () => {
    const visibleImageWrapper = document.querySelector('[id^="map-imagewrapper-"]:not(.hidden)');
    if (visibleImageWrapper) {
      const mapId = extractMapId(visibleImageWrapper.id);
      return document.querySelector(`#map-image-${mapId}`);
    }
    return null;
  };
  var getElementNaturalDimensions = (element) => {
    const { naturalHeight, naturalWidth } = element;
    return {
      naturalHeight,
      naturalWidth
    };
  };
  var getElementRealDimensions = (element) => {
    const { width, height, top, left } = element.getBoundingClientRect();
    return {
      width,
      height,
      top,
      left
    };
  };
  var getElementPaddings = (element) => {
    const leftPadding = parseInt(window.getComputedStyle(element).getPropertyValue("padding-left").replace("px", ""));
    const rightPadding = parseInt(window.getComputedStyle(element).getPropertyValue("padding-top").replace("px", ""));
    const topPadding = parseInt(window.getComputedStyle(element).getPropertyValue("padding-top").replace("px", ""));
    const bottomPadding = parseInt(window.getComputedStyle(element).getPropertyValue("padding-top").replace("px", ""));
    return {
      leftPadding,
      rightPadding,
      topPadding,
      bottomPadding
    };
  };
  var setVisibleMapTransformOrigin = () => {
    const visibleImageWrapper = document.querySelector('[id^="map-imagewrapper-"]:not(.hidden)');
    if (!(visibleImageWrapper instanceof HTMLDivElement)) {
      throw new Error("Imagewrapper element is missing");
    }
    const { top, left } = getElementRealDimensions(visibleImageWrapper);
    visibleImageWrapper.style.transformOrigin = `${-left}px ${-top}px`;
  };

  // src/ts/mapview/zoom-and-pan-listeners.ts
  var clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  var showResetZoomButton = () => {
    const resetButton = document.getElementById("reset-zoom-button");
    if (!resetButton) {
      throw new Error("Reset button is missing");
    }
    resetButton.classList.remove("hidden");
  };
  var hideResetZoomButton = () => {
    const resetButton = document.getElementById("reset-zoom-button");
    if (!resetButton) {
      throw new Error("Reset button is missing");
    }
    resetButton.classList.add("hidden");
  };
  var setZoomAndPanListeners = () => {
    const imageWrappers = document.querySelectorAll("[id^=map-imagewrapper-]");
    imageWrappers.forEach((imageWrapper) => {
      if (!(imageWrapper instanceof HTMLDivElement)) {
        throw new Error("element with `map-imagewrapper-` id is not a div element");
      }
      let activeTransform = false;
      let panning = false;
      let scale = 1;
      let pointX = 0;
      let pointY = 0;
      let startX = 0;
      let startY = 0;
      const setTransform = () => {
        imageWrapper.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
      };
      imageWrapper.onmousedown = (event) => {
        event.preventDefault();
        const { clientX, clientY, buttons } = event;
        if (buttons !== 1 && buttons !== 4) {
          return;
        }
        startX = clientX - pointX;
        startY = clientY - pointY;
        panning = true;
        imageWrapper.style.cursor = "grabbing";
      };
      imageWrapper.onmouseup = () => {
        panning = false;
        imageWrapper.style.cursor = "grab";
      };
      imageWrapper.onmousemove = (event) => {
        event.preventDefault();
        if (!panning) {
          return;
        }
        if (!activeTransform) {
          showResetZoomButton();
          activeTransform = true;
        }
        const { clientX, clientY } = event;
        pointX = clientX - startX;
        pointY = clientY - startY;
        setTransform();
      };
      imageWrapper.onwheel = (event) => {
        event.preventDefault();
        if (!activeTransform) {
          showResetZoomButton();
          activeTransform = true;
        }
        const { clientX, clientY, deltaY } = event;
        const xs = (clientX - pointX) / scale;
        const ys = (clientY - pointY) / scale;
        const delta = -deltaY;
        const maxWheelDown = 6;
        const maxWheelUp = 1;
        const scaleFactor = 1.2;
        if (delta > 0) {
          scale = clamp(scale * scaleFactor, 1 / __pow(scaleFactor, maxWheelUp), __pow(scaleFactor, maxWheelDown));
        } else {
          scale = clamp(scale / scaleFactor, 1 / __pow(scaleFactor, maxWheelUp), __pow(scaleFactor, maxWheelDown));
        }
        pointX = clientX - xs * scale;
        pointY = clientY - ys * scale;
        setTransform();
      };
      const reset = () => {
        panning = false;
        scale = 1;
        pointX = 0;
        pointY = 0;
        startX = 0;
        startY = 0;
        setTransform();
        hideResetZoomButton();
        activeTransform = false;
      };
      window.addEventListener("resize", () => {
        reset();
        setVisibleMapTransformOrigin();
      });
      const mapButtons = document.querySelectorAll('input[name="map-selector"]');
      mapButtons.forEach((element) => {
        element.addEventListener("change", reset);
      });
      const resetButton = document.getElementById("reset-zoom-button");
      if (!resetButton) {
        throw new Error("Reset button is missing");
      }
      resetButton.addEventListener("click", reset);
    });
  };

  // src/ts/mapview/place-marker.ts
  var placeVisibleMarker = () => {
    if (document.getElementsByClassName("map-image-marker").length === 0) {
      return;
    }
    const visibleImageWrapper = document.querySelector('[id^="map-imagewrapper-"]:not(.hidden)');
    if (!(visibleImageWrapper instanceof HTMLDivElement)) {
      throw new Error("Imagewrapper element is missing");
    }
    const mapId = extractMapId(visibleImageWrapper.id);
    placeMarker(mapId);
  };
  var placeMarker = (mapId) => {
    const mapImageWrapperElement = document.getElementById(`map-imagewrapper-${mapId}`);
    const mapImageElement = document.getElementById(`map-image-${mapId}`);
    const mapMarkerElement = document.getElementById(`map-marker-${mapId}`);
    if (!(mapImageWrapperElement instanceof HTMLDivElement)) {
      throw new Error(`Imagewrapper for mapId ${mapId} is missing`);
    }
    if (!(mapImageElement instanceof HTMLImageElement)) {
      throw new Error(`Image for mapId ${mapId} is missing`);
    }
    if (!(mapMarkerElement instanceof HTMLImageElement)) {
      throw new Error(`Marker icon for mapId ${mapId} is missing`);
    }
    const mapNaturalDimensions = getElementNaturalDimensions(mapImageElement);
    const mapRealDimensions = getElementRealDimensions(mapImageElement);
    const markerRealDimensions = getElementRealDimensions(mapMarkerElement);
    const { leftPadding, topPadding } = getElementPaddings(mapImageWrapperElement);
    const { markerx, markery } = mapMarkerElement.dataset;
    if (!markerx || !markery) {
      throw new Error("Marker coordinates not provided");
    }
    const markerRelativeX = Math.round(parseInt(markerx) * mapRealDimensions.width / mapNaturalDimensions.naturalWidth - markerRealDimensions.width / 2) + leftPadding;
    const markerRelativeY = Math.round(parseInt(markery) * mapRealDimensions.height / mapNaturalDimensions.naturalHeight - markerRealDimensions.height) + topPadding;
    mapMarkerElement.style.top = `${markerRelativeY}px`;
    mapMarkerElement.style.left = `${markerRelativeX}px`;
    mapMarkerElement.style.opacity = "0.85";
  };

  // src/ts/mapview/map-selector-listener.ts
  var handleMapSelectorChange = (event) => {
    const target = event.target;
    const mapId = extractMapId(target.id);
    const mapWrappers = document.querySelectorAll("[id^=map-imagewrapper-]");
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
    setVisibleMapTransformOrigin();
    placeVisibleMarker();
  };
  var setMapSelectorListeners = () => {
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

  // src/ts/map.ts
  var init = () => {
    setVisibleMapTransformOrigin();
    setZoomAndPanListeners();
    setMapSelectorListeners();
    placeVisibleMarker();
    window.addEventListener("resize", () => {
      placeVisibleMarker();
    });
  };
  document.addEventListener("DOMContentLoaded", () => {
    const visibleImage = getVisibleImage();
    if (!(visibleImage instanceof HTMLImageElement)) {
      throw new Error("No Image Available map page");
    }
    if (visibleImage.complete) {
      init();
    } else {
      visibleImage.addEventListener("load", () => {
        init();
      });
    }
  });
})();
//# sourceMappingURL=map.js.map
