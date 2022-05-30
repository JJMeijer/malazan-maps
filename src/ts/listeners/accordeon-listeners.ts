export const setAccordeonListener = (): void => {
    const accordeonCheckboxes = document.querySelectorAll(
        "input.accordeon-checkbox",
    ) as NodeListOf<HTMLInputElement>;

    /**
     * I don't like this, but I also don't like other solutions.
     */
    accordeonCheckboxes.forEach((accordeonCheckbox) => {
        accordeonCheckbox.addEventListener("change", () => {
            const accordeonParent = accordeonCheckbox.closest(".accordeon-parent");
            if (!(accordeonParent instanceof HTMLDivElement)) {
                throw new Error("accordeonParent is not an HTMLDivElement");
            }

            const accordeonContent = accordeonParent.querySelector(".accordeon-content");
            if (!(accordeonContent instanceof HTMLDivElement)) {
                throw new Error("accordeonContent is not an HTMLDivElement");
            }

            if (accordeonCheckbox.checked) {
                accordeonContent.classList.replace("max-h-0", "max-h-full");
                accordeonContent.classList.replace("opacity-0", "opacity-100");
            } else {
                accordeonContent.classList.replace("max-h-full", "max-h-0");
                accordeonContent.classList.replace("opacity-100", "opacity-0");
            }
        });
    });
};
