(() => {
  // mapsdata/src/ts/admin/marker.ts
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
  var placeImageMarker = () => {
    const mapElement = document.getElementById("map-image");
    const markerElement = document.getElementById("map-marker");
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
        markerElement.style.opacity = "0.9";
      } else {
        throw new Error("Marker coordinates not provided");
      }
    } else {
      throw new Error("Invalid Map or Marker element");
    }
  };
  var setEventListeners = () => {
    window.addEventListener("resize", placeImageMarker);
    const xInputField = document.querySelector(".fieldBox.field-x input");
    const yInputField = document.querySelector(".fieldBox.field-y input");
    const markerElement = document.getElementById("map-marker");
    if (!(xInputField instanceof HTMLInputElement)) {
      throw new Error("X Input field not found");
    }
    if (!(yInputField instanceof HTMLInputElement)) {
      throw new Error("Y Input field not found");
    }
    if (!(markerElement instanceof HTMLImageElement)) {
      throw new Error("Marker element not found");
    }
    xInputField.addEventListener("change", () => {
      const newValue = xInputField.value;
      markerElement.dataset["markerx"] = newValue;
      placeImageMarker();
    });
    yInputField.addEventListener("change", () => {
      const newValue = yInputField.value;
      markerElement.dataset["markery"] = newValue;
      placeImageMarker();
    });
  };
  var initMarkerPage = () => {
    placeImageMarker();
    setEventListeners();
  };
  document.addEventListener("DOMContentLoaded", () => {
    const markerForm = document.getElementById("marker_form");
    if (markerForm instanceof HTMLFormElement) {
      const visibleImage = document.getElementById("map-image");
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
    }
  });
})();
//# sourceMappingURL=marker.js.map
