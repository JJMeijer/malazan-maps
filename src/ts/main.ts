import {
    setErrorListener,
    setLoadListener,
    setSearchListeners,
    setMapListeners,
} from "./listeners";

const setListeners = (): void => {
    setErrorListener();
    setLoadListener();
    setSearchListeners();
    setMapListeners();
};

if (document.readyState !== "loading") {
    setListeners();
} else {
    document.addEventListener("DOMContentLoaded", () => {
        setListeners();
    });
}
