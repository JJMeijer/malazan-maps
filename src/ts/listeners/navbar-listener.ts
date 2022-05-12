import { safeGetElementById } from "./helpers";

export const setNavbarListener = (): void => {
    const hamburgerElement = safeGetElementById("hamburger");

    hamburgerElement.addEventListener("change", (event) => {
        const { checked } = event.target as HTMLInputElement;

        const navbarItemsElement = safeGetElementById("navbarItems");

        if (checked) {
            navbarItemsElement.classList.add("-translate-x-full");
        } else {
            navbarItemsElement.classList.remove("-translate-x-full");
        }
    });
};
