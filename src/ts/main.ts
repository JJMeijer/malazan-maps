import {
    setErrorListener,
    setLoadListener,
    setSearchListeners,
    setMapListeners,
    setNavbarListener,
} from "./listeners";

const setListeners = (): void => {
    setErrorListener();
    setLoadListener();
    setSearchListeners();
    setMapListeners();
    setNavbarListener();
};

if (document.readyState !== "loading") {
    setListeners();
} else {
    document.addEventListener("DOMContentLoaded", () => {
        setListeners();
    });
}
