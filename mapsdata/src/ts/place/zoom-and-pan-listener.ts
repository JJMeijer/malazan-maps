import { setElementTransformOrigin } from './element-helpers';

const clamp = (num: number, min: number, max: number): number => Math.min(Math.max(num, min), max);

const showResetZoomButton = () => {
    const resetButton = document.getElementById('reset-zoom-button');

    if (!resetButton) {
        throw new Error('Reset button is missing');
    }

    resetButton.classList.remove('hidden');
};

const hideResetZoomButton = () => {
    const resetButton = document.getElementById('reset-zoom-button');

    if (!resetButton) {
        throw new Error('Reset button is missing');
    }

    resetButton.classList.add('hidden');
};

export const setZoomAndPanListeners = (): void => {
    const imageWrappers = document.querySelectorAll('[id^=map-imagewrapper-]');

    imageWrappers.forEach((imageWrapper) => {
        if (!(imageWrapper instanceof HTMLDivElement)) {
            throw new Error('element with `map-imagewrapper-` id is not a div element');
        }

        let activeTransform = false;
        let panning = false;
        let scale = 1;
        let pointX = 0;
        let pointY = 0;
        let startX = 0;
        let startY = 0;

        const setTransform = () => {
            imageWrapper.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
        };

        imageWrapper.onmousedown = (event) => {
            event.preventDefault();
            const { clientX, clientY } = event;

            startX = clientX - pointX;
            startY = clientY - pointY;

            panning = true;
        };

        imageWrapper.onmouseup = () => {
            panning = false;
        };

        imageWrapper.onmousemove = (event) => {
            event.preventDefault();

            if (!panning) {
                return;
            }

            if (!activeTransform) {
                showResetZoomButton();
                activeTransform = true;
            }

            const { clientX, clientY } = event;

            pointX = clientX - startX;
            pointY = clientY - startY;
            setTransform();
        };

        imageWrapper.onwheel = (event) => {
            event.preventDefault();

            if (!activeTransform) {
                showResetZoomButton();
                activeTransform = true;
            }

            const { clientX, clientY, deltaY } = event;

            const xs = (clientX - pointX) / scale;
            const ys = (clientY - pointY) / scale;
            const delta = -deltaY;

            const maxWheelDown = 6;
            const maxWheelUp = 1;
            const scaleFactor = 1.2;

            if (delta > 0) {
                scale = clamp(
                    scale * scaleFactor,
                    1 / scaleFactor ** maxWheelUp,
                    scaleFactor ** maxWheelDown,
                );
            } else {
                scale = clamp(
                    scale / scaleFactor,
                    1 / scaleFactor ** maxWheelUp,
                    scaleFactor ** maxWheelDown,
                );
            }

            pointX = clientX - xs * scale;
            pointY = clientY - ys * scale;

            setTransform();
        };

        const reset = () => {
            panning = false;
            scale = 1;
            pointX = 0;
            pointY = 0;
            startX = 0;
            startY = 0;

            setTransform();
            hideResetZoomButton();

            activeTransform = false;
        };

        window.addEventListener('resize', () => {
            reset();
            setElementTransformOrigin(imageWrapper);
        });

        const mapButtons = document.querySelectorAll('input[name="map-selector"]');
        mapButtons.forEach((element) => {
            element.addEventListener('change', reset);
        });

        const resetButton = document.getElementById('reset-zoom-button');

        if (!resetButton) {
            throw new Error('Reset button is missing');
        }

        resetButton.addEventListener('click', reset);
    });
};
