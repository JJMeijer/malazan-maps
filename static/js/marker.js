(() => {
  // static/ts/marker.ts
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
        if (markerElement.classList.contains("opacity-0")) {
          markerElement.classList.remove("opacity-0");
        }
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
    mapButtons.forEach((element) => {
      element.addEventListener("change", handleMapSelectorChange);
    });
  };
  var placeVisibleMarker = () => {
    const visibleImageWrapper = document.querySelector('[id^="map-imagewrapper-"]:not(.hidden)');
    if (visibleImageWrapper) {
      const mapId = getMapId(visibleImageWrapper.id);
      placeImageMarker(mapId);
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    placeVisibleMarker();
    window.addEventListener("resize", placeVisibleMarker);
    setImageSelectorListener();
  });
})();
//# sourceMappingURL=marker.js.map
