export const throwIfUndefined = (value: any, errorMessage: string) => {
    if (value === undefined) {
        throw new Error(errorMessage);
    }
};
