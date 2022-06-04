import { safeGetElementById } from "./helpers";

const hideNavbar = (): void => {
    const navbarItemsElement = safeGetElementById("navbarItems");
    navbarItemsElement.classList.remove("-translate-x-full");
};

const showNavbar = (): void => {
    const navbarItemsElement = safeGetElementById("navbarItems");
    navbarItemsElement.classList.add("-translate-x-full");
};

const checkHamburger = (): void => {
    const hamburgerElement = safeGetElementById("hamburger") as HTMLInputElement;
    hamburgerElement.checked = !hamburgerElement.checked;
};

const navbarActiveClickListener = (event: MouseEvent): void => {
    const { target } = event;
    if (target instanceof HTMLElement && target.matches("#navbarItems *")) {
        return;
    }

    if (target instanceof HTMLElement && target.matches("#hamburger-label, #hamburger-label *")) {
        return;
    }

    checkHamburger();
    hideNavbar();
    document.removeEventListener("click", navbarActiveClickListener);
};

export const setNavbarListener = (): void => {
    const hamburgerElement = safeGetElementById("hamburger");

    hamburgerElement.addEventListener("change", (event) => {
        const { checked } = event.target as HTMLInputElement;

        if (checked) {
            showNavbar();
            document.addEventListener("click", navbarActiveClickListener);
        } else {
            hideNavbar();
            document.removeEventListener("click", navbarActiveClickListener);
        }
    });
};
