export const extractMapId = (elementIdString: string): string => {
    const lastKebabCaseItem = elementIdString.split("-").slice(-1);

    if (lastKebabCaseItem[0]) {
        return lastKebabCaseItem[0];
    }

    throw new Error("Map ID not found");
};
