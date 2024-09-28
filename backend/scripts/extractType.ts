
// Helper function to extract inner type from generics like Promise<T>
export const extractInnerType = (type: string): string => {
  const promiseMatch = type.match(/Promise<(.*)>/);
  if (promiseMatch) {
    return promiseMatch[1].trim();  // Extract the type inside Promise<>
  }
  return type;
};

// Helper function to extract inner type from arrays like T[]
export const extractArrayType = (type: string): string => {
  const arrayMatch = type.match(/^(.*)\[\]$/);
  return arrayMatch ? arrayMatch[1].trim() :
                      type;  // Extract the type inside array brackets
};

// Helper function to extract union types like (TypeA | TypeB)
export const extractUnionTypes = (type: string): string[] => {
  const unionMatch = type.match(/^\((.*)\)$/);
  if (unionMatch) {
    return unionMatch[1].split('|').map((t) => t.trim());  // Split union types
  }
  return [type];  // Return the type as an array if not a union
};
