(() => {
  // mapsdata/src/ts/marker.ts
  var getElementNaturalDimensions = (element) => {
    const { naturalHeight, naturalWidth } = element;
    return {
      naturalHeight,
      naturalWidth
    };
  };
  var getElementRealDimensions = (element) => {
    const { width, height } = element.getBoundingClientRect();
    return {
      width,
      height
    };
  };
  var placeImageMarker = (mapId) => {
    const mapElement = document.getElementById(`map-image-${mapId}`);
    const markerElement = document.getElementById(`map-marker-${mapId}`);
    if (mapElement instanceof HTMLImageElement && markerElement instanceof HTMLElement) {
      const mapNaturalDimensions = getElementNaturalDimensions(mapElement);
      const mapRealDimensions = getElementRealDimensions(mapElement);
      const markerRealDimensions = getElementRealDimensions(markerElement);
      const { markerx, markery } = markerElement.dataset;
      if (markerx && markery) {
        const markerRelativeX = Math.round(parseInt(markerx) * mapRealDimensions.width / mapNaturalDimensions.naturalWidth - markerRealDimensions.width / 2);
        const markerRelativeY = Math.round(parseInt(markery) * mapRealDimensions.height / mapNaturalDimensions.naturalHeight - markerRealDimensions.height);
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
  var setImageSelectorListener = () => {
    const mapButtons = document.querySelectorAll('input[name="map-selector"]');
    const mapButtonSpans = document.querySelectorAll('input[name="map-selector"]~span');
    mapButtons.forEach((element) => {
      if (!(element instanceof HTMLInputElement)) {
        throw new Error("Map Input has unexpected type");
      }
      element.addEventListener("change", handleMapSelectorChange);
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
  var initMarkerPage = () => {
    placeVisibleMarker();
    window.addEventListener("resize", placeVisibleMarker);
    setImageSelectorListener();
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
