// scripts/generate-endpoint-map.ts

import * as fs from "fs";
import * as path from "path";
import { basicTypes, EndpointMapping } from "./analyzer";
import { findDirectoryUpwards } from "./findDirectory";

export const generateEndPointTypes = (endPointMap: EndpointMapping) => {
    const frontendDirPath = findDirectoryUpwards();
<<<<<<< HEAD
    if (!frontendDirPath) return;

=======
    if (!frontendDirPath) {
      console.error('Frontend directory not found.');
      process.exit(1);
    }
>>>>>>> MongooseBackend
    // Define the output path for the generated TypeScript file
    const outputPath = path.join(
        frontendDirPath,
        "src",
        "endPointTypes",
        "endpointTypes.ts"
    );

    // Ensure the output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`Created directory: ${outputDir}`);
    }

    const endpointMapData = endPointMap;

    // Set to collect unique non-primitive type names
    const importsSet = new Set<string>();

    /**
     * Extracts type names from a given type string.
     * Handles basic types, arrays, unions, intersections, and generics.
     *
     * @param typeStr - The type string to extract from (e.g.,
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

    // Iterate over each endpoint in endpointMapData to collect types
    for (const [_, returnType] of Object.entries(endpointMapData)) {
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

    // Define the module path where all non-primitive types are exported from
    // Adjust this path based on your project's structure relative to the
    // output file
    const typesModulePath = "./types";

    // Generate import statements based on the collected types
    let importStatements = "";
    if (importsSet.size > 0) {
        importStatements = `import { ${Array.from(importsSet).join(", ")} } from '${
            typesModulePath
        }';\n\n`;
    }

    // Start building the TypeScript content
    let endpointMapTsContent = `// This file is auto-generated from endpointMap.json. Do not modify manually.\n\n`;

    endpointMapTsContent += importStatements;

    // Export endpointMap constant
    endpointMapTsContent += `export const endpointMap = {\n`;
    for (const [endpoint, returnType] of Object.entries(endpointMapData)) {
        endpointMapTsContent += `  "${endpoint}": "${returnType}",\n`;
    }
    endpointMapTsContent += `} as const;\n\n`;

    // Export Endpoint type
    endpointMapTsContent += `export type Endpoint = keyof typeof endpointMap;\n\n`;

    // Export ApiResponseTypes type
    endpointMapTsContent += `export type ApiResponseTypes = {\n`;
    for (const [endpoint, returnType] of Object.entries(endpointMapData)) {
        // Extract the type inside Promise<>
        const promiseMatch = (returnType as string).match(/Promise<(.*)>/);
        const actualType = promiseMatch
            ? promiseMatch[1].trim()
            : (returnType as string);

        endpointMapTsContent += `  "${endpoint}": ${actualType};\n`;
    }
    endpointMapTsContent += `};\n`;

    // Write the generated content to endpointMap.ts
    try {
        fs.writeFileSync(outputPath, endpointMapTsContent, "utf-8");
        console.log(`Successfully generated ${outputPath}`);
    } catch (err) {
        console.error(`Error writing to ${outputPath}:`, err);
        process.exit(1);
    }
};
