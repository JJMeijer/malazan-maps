export const setErrorListener = (): void => {
    window.addEventListener('error', (errorEvent) => {
        const { message, filename, lineno, colno, type } = errorEvent;

        const params = new URLSearchParams({
            type: type,
            message: message,
            filename: filename,
            lineno: String(lineno),
            colno: String(colno),
        });
        fetch(`/error.js?${params.toString()}`);
    });
};
