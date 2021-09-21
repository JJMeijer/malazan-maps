(() => {
  var __pow = Math.pow;
  var __require = typeof require !== "undefined" ? require : (x) => {
    throw new Error('Dynamic require of "' + x + '" is not supported');
  };

  // mapsdata/src/ts/marker.ts
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
  var getImageWrapperPaddings = (mapId) => {
    const imageWrapper = document.getElementById(`map-imagewrapper-${mapId}`);
    if (!(imageWrapper instanceof HTMLDivElement)) {
      throw new Error(`Image wrapper missing for mapId: ${mapId}`);
    }
    const leftPadding = parseInt(window.getComputedStyle(imageWrapper).getPropertyValue("padding-left").replace("px", ""));
    const topPadding = parseInt(window.getComputedStyle(imageWrapper).getPropertyValue("padding-top").replace("px", ""));
    return {
      leftPadding,
      topPadding
    };
  };
  var clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  var placeImageMarker = (mapId) => {
    const mapElement = document.getElementById(`map-image-${mapId}`);
    const markerElement = document.getElementById(`map-marker-${mapId}`);
    if (mapElement instanceof HTMLImageElement && markerElement instanceof HTMLElement) {
      const mapNaturalDimensions = getElementNaturalDimensions(mapElement);
      const mapRealDimensions = getElementRealDimensions(mapElement);
      const markerRealDimensions = getElementRealDimensions(markerElement);
      const { leftPadding, topPadding } = getImageWrapperPaddings(mapId);
      const { markerx, markery } = markerElement.dataset;
      if (markerx && markery) {
        const markerRelativeX = Math.round(parseInt(markerx) * mapRealDimensions.width / mapNaturalDimensions.naturalWidth - markerRealDimensions.width / 2) + leftPadding;
        const markerRelativeY = Math.round(parseInt(markery) * mapRealDimensions.height / mapNaturalDimensions.naturalHeight - markerRealDimensions.height) + topPadding;
        markerElement.style.top = `${markerRelativeY}px`;
        markerElement.style.left = `${markerRelativeX}px`;
        markerElement.classList.remove("opacity-0");
        markerElement.classList.add("opacity-90");
      } else {
        throw new Error("Marker coordinates not provided");
      }
    } else {
      throw new Error("Invalid Map or Marker element");
    }
  };
  var getMapId = (text) => {
    const lastKebabCaseItem = text.split("-").slice(-1);
    if (lastKebabCaseItem[0]) {
      return lastKebabCaseItem[0];
    }
    throw new Error("Map ID not found");
  };
  var handleMapSelectorChange = (event) => {
    const target = event.target;
    const mapId = getMapId(target.id);
    const mapWrappers = document.querySelectorAll("[id^=map-imagewrapper-]");
    mapWrappers.forEach((mapWrapper) => {
      if (!mapWrapper.classList.contains("hidden")) {
        mapWrapper.classList.add("hidden");
      }
    });
    const selectedImageWrapper = document.getElementById(`map-imagewrapper-${mapId}`);
    if (selectedImageWrapper) {
      selectedImageWrapper.classList.remove("hidden");
    }
    placeImageMarker(mapId);
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
  var placeVisibleMarker = () => {
    const visibleImageWrapper = document.querySelector('[id^="map-imagewrapper-"]:not(.hidden)');
    if (visibleImageWrapper) {
      const mapId = getMapId(visibleImageWrapper.id);
      placeImageMarker(mapId);
    }
  };
  var getVisibleImage = () => {
    const visibleImageWrapper = document.querySelector('[id^="map-imagewrapper-"]:not(.hidden)');
    if (visibleImageWrapper) {
      const mapId = getMapId(visibleImageWrapper.id);
      return document.querySelector(`#map-image-${mapId}`);
    }
    return null;
  };
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
    const mapImages = document.querySelectorAll("[id^=map-imagewrapper-]");
    mapImages.forEach((mapImageElement) => {
      if (!(mapImageElement instanceof HTMLDivElement)) {
        throw new Error("element with `map-imagewrapper-` id is not a div element");
      }
      const setTransformOrigin = () => {
        const { top, left } = getElementRealDimensions(mapImageElement);
        mapImageElement.style.transformOrigin = `${-left}px ${-top}px`;
      };
      setTransformOrigin();
      let activeTransform = false;
      let panning = false;
      let scale = 1;
      let pointX = 0;
      let pointY = 0;
      let startX = 0;
      let startY = 0;
      const setTransform = () => {
        mapImageElement.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
      };
      mapImageElement.onmousedown = (event) => {
        event.preventDefault();
        const { clientX, clientY } = event;
        startX = clientX - pointX;
        startY = clientY - pointY;
        panning = true;
      };
      mapImageElement.onmouseup = () => {
        panning = false;
      };
      mapImageElement.onmousemove = (event) => {
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
      mapImageElement.onwheel = (event) => {
        event.preventDefault();
        if (!activeTransform) {
          showResetZoomButton();
          activeTransform = true;
        }
        const { clientX, clientY, deltaY } = event;
        const xs = (clientX - pointX) / scale;
        const ys = (clientY - pointY) / scale;
        const delta = -deltaY;
        const maxWheelDown = 5;
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
        setTransformOrigin();
        hideResetZoomButton();
        activeTransform = false;
      };
      window.addEventListener("resize", reset);
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
  var initMarkerPage = () => {
    placeVisibleMarker();
    setZoomAndPanListeners();
    window.addEventListener("resize", () => {
      placeVisibleMarker();
    });
    setMapSelectorListeners();
  };
  document.addEventListener("DOMContentLoaded", () => {
    const visibleImage = getVisibleImage();
    if (visibleImage === null || !(visibleImage instanceof HTMLImageElement)) {
      throw new Error("No Image Available on Marker page");
    }
    if (visibleImage.complete) {
      initMarkerPage();
    } else {
      visibleImage.addEventListener("load", () => {
        initMarkerPage();
      });
    }
  });
})();
//# sourceMappingURL=marker.js.map
