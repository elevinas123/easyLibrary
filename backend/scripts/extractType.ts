// Helper function to extract inner type from generics like Promise<T>
export const extractInnerType = (type: string): string => {
    const promiseMatch = type.match(/Promise<(.*)>/);
    if (promiseMatch) {
        return promiseMatch[1].trim(); // Extract the type inside Promise<>
    }
    return type;
};

// Helper function to extract inner type from arrays like T[]
export const extractArrayType = (type: string): string => {
    const arrayMatch = type.match(/^(.*)\[\]$/);
    return arrayMatch ? arrayMatch[1].trim() : type; // Extract the type inside array brackets
};

// extractType.ts
export const extractUnionTypes = (type: string): string[] => {
    // Remove surrounding parentheses if they exist
    const trimmedType =
        type.startsWith("(") && type.endsWith(")") ? type.slice(1, -1) : type;

    // Split the type string on '|' and trim each element
    return trimmedType.split("|").map((t) => t.trim());
};
