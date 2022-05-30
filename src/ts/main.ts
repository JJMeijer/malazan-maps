import {
    setErrorListener,
    setLoadListener,
    setSearchListeners,
    setMapListeners,
    setNavbarListener,
    setAccordeonListener,
} from "./listeners";

const setListeners = (): void => {
    setErrorListener();
    setLoadListener();
    setSearchListeners();
    setMapListeners();
    setNavbarListener();
    setAccordeonListener();
};

if (document.readyState !== "loading") {
    setListeners();
} else {
    document.addEventListener("DOMContentLoaded", () => {
        setListeners();
    });
}
