export const getMapId = (text: string): string => {
    const lastKebabCaseItem = text.split('-').slice(-1);

    if (lastKebabCaseItem[0]) {
        return lastKebabCaseItem[0];
    }

    throw new Error('Map ID not found');
};
