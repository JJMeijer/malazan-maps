export const safeGetElementById = (id: string): HTMLElement => {
    const element = document.getElementById(id);

    if (!(element instanceof HTMLElement)) {
        throw new Error("Element is unexpectedly missing");
    }

    return element;
};
