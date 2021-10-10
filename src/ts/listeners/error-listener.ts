export const setErrorListener = (): void => {
    const errors: string[] = [];

    window.addEventListener('error', (errorEvent) => {
        const {
            filename,
            error: { message, stack, name },
        } = errorEvent;

        const errString = [filename, message, name].join('');

        if (errors.indexOf(errString) === -1) {
            errors.push(errString);

            const params = new URLSearchParams({
                name: name,
                message: message,
                stack: stack,
            });
            fetch(`/static/js/error.js?${params.toString()}`);
        }
    });
};
