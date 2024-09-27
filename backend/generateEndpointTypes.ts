// backend/generate-endpoint-map.ts

import * as fs from "fs";
import * as path from "path";

// Paths to your JSON files
const endpointMapJsonPath = path.resolve(__dirname, "endpointMap.json");
const endpointMapTsPath = path.resolve(
    __dirname,
    "../frontend/src/endPointTypes/endpointMap.ts"
);

// Path to the types module in frontend
const typesModulePath = "./types"; // Adjust this path if necessary

// Read endpointMap.json
const endpointMapJson = JSON.parse(
    fs.readFileSync(endpointMapJsonPath, "utf-8")
);

// Define basic primitive types to exclude from imports
const basicTypes = [
    "string",
    "number",
    "boolean",
    "void",
    "any",
    "null",
    "undefined",
    "never",
];

// Set to collect unique non-primitive type names
const importsSet = new Set<string>();

/**
 * Extracts type names from a given type string.
 * Handles basic types, arrays, unions, intersections, and generics.
 *
 * @param typeStr The type string to extract from (e.g.,
 *     "Promise<CreateBookDto>")
 * @returns An array of extracted type names
 */
function extractTypeNames(typeStr: string): string[] {
    const typeNames: string[] = [];

    // Remove array brackets
    let cleanedTypeStr = typeStr.replace(/\[\]/g, "");

    // Split by union and intersection operators
    const splitTypes = cleanedTypeStr
        .split(/[\|\&]/)
        .map((type) => type.trim());

    splitTypes.forEach((type) => {
        // Remove generic wrappers (e.g., Promise<CreateBookDto> => CreateBookDto)
        const genericMatch = type.match(/^(\w+)<(.+)>$/);
        if (genericMatch) {
            const innerType = genericMatch[2];
            typeNames.push(...extractTypeNames(innerType));
        } else {
            // Exclude basic types and inline object types
            if (
                !basicTypes.includes(type.toLowerCase()) &&
                !type.startsWith("{") &&
                /^[A-Za-z_][A-Za-z0-9_]*$/.test(type)
            ) {
                typeNames.push(type);
            }
        }
    });

    return typeNames;
}

// Iterate over each endpoint in endpointMapJson to collect types
for (const [endpoint, returnType] of Object.entries(endpointMapJson)) {
    // Extract the type inside Promise<>
    const promiseMatch = (returnType as string).match(/Promise<(.*)>/);
    const actualType = promiseMatch
        ? promiseMatch[1].trim()
        : (returnType as string);

    // Extract type names from the actualType
    const extractedTypes = extractTypeNames(actualType);

    // Add extracted types to the imports set
    extractedTypes.forEach((type) => importsSet.add(type));
}

// Generate import statements based on the collected types
let importStatements = "";
if (importsSet.size > 0) {
    importStatements = `import { ${Array.from(importsSet).join(", ")} } from '${
        typesModulePath
    }';\n\n`;
}

// Start building the TypeScript content
let endpointMapTsContent = `// This file is auto-generated from endpointMap.json. Do not modify manually.\n\n`;

// Add import statements
endpointMapTsContent += importStatements;

// Export endpointMap constant
endpointMapTsContent += `export const endpointMap = {\n`;
for (const [endpoint, returnType] of Object.entries(endpointMapJson)) {
    endpointMapTsContent += `  "${endpoint}": "${returnType}",\n`;
}
endpointMapTsContent += `} as const;\n\n`;

// Export Endpoint type
endpointMapTsContent += `export type Endpoint = keyof typeof endpointMap;\n\n`;

// Export ApiResponseTypes type
endpointMapTsContent += `export type ApiResponseTypes = {\n`;
for (const [endpoint, returnType] of Object.entries(endpointMapJson)) {
    // Extract the type inside Promise<>
    const promiseMatch = (returnType as string).match(/Promise<(.*)>/);
    const actualType = promiseMatch
        ? promiseMatch[1].trim()
        : (returnType as string);

    endpointMapTsContent += `  "${endpoint}": ${actualType};\n`;
}
endpointMapTsContent += `};\n`;

// Write to endpointMap.ts
fs.writeFileSync(endpointMapTsPath, endpointMapTsContent, "utf-8");

console.log(`Generated ${endpointMapTsPath} successfully.`);
