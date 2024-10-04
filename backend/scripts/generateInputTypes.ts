// scripts/generateInputMap.ts

import * as fs from "fs";
import * as path from "path";
import { EndpointMapping, InputMapping } from "./analyzer";
import { findDirectoryUpwards } from "./findDirectory";
export const generateInputTypes = (
    inputMap: InputMapping,
    endPointMap: EndpointMapping
) => {
    const frontendDirPath = findDirectoryUpwards();
    if (!frontendDirPath) {
      console.error('Frontend directory not found.');
      process.exit(1);
    }
    // Define the output path for the generated TypeScript file
    const outputPath = path.join(
        frontendDirPath,
        "src",
        "endPointTypes",
        "inputMap.ts"
    );

    // Ensure the output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`Created directory: ${outputDir}`);
    }

    // Define basic primitive types to exclude from imports
    const basicTypes = ["string", "number", "boolean"];

    // Set to collect unique non-primitive type names
    const imports = new Set<string>();

    /**
     * Extracts type names from a given type string.
     * This function handles basic types, arrays, unions, intersections, and
     * generics. It assumes that non-primitive types are single words (e.g.,
     * CreateBookDto).
     *
     * @param typeStr - The type string to extract from (e.g., "CreateBookDto
     *     | UpdateBookDto[]")
     * @returns An array of extracted type names
     */
    function extractTypeNames(typeStr: string): string[] {
        const typeNames: string[] = [];

        // Remove array brackets
        const cleanedTypeStr = typeStr.replace(/\[\]/g, "");

        // Split by union and intersection operators
        const splitTypes = cleanedTypeStr
            .split(/[\|\&]/)
            .map((type) => type.trim());

        splitTypes.forEach((type) => {
            // Remove generic wrappers (e.g., Partial<CreateBookDto> => CreateBookDto)
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

    // Iterate over each endpoint in endpointMapData
    for (const endpoint of Object.keys(endPointMap)) {
        if (inputMap.hasOwnProperty(endpoint)) {
            const inputs = inputMap[endpoint];

            // Check and collect types from query
            if (inputs.query) {
                const queryTypes = extractTypeNames(inputs.query);
                queryTypes.forEach((type) => imports.add(type));
            }

            // Check and collect types from params
            if (inputs.params) {
                const paramsTypes = extractTypeNames(inputs.params);
                paramsTypes.forEach((type) => imports.add(type));
            }

            // Check and collect types from body
            if (inputs.body) {
                const bodyTypes = extractTypeNames(inputs.body);
                bodyTypes.forEach((type) => imports.add(type));
            }
        }
    }

    // Define the module path where all non-primitive types are exported from
    const typesModulePath = "./types";

    // Generate import statements
    let importStatements = "";
    if (imports.size > 0) {
        importStatements = `import { ${Array.from(imports).join(", ")} } from '${
            typesModulePath
        }';\n\n`;
    }

    // Start building the TypeScript content
    let tsContent = `// This file is auto-generated from inputMap.json and endpointMap.json. Do not modify manually.\n\n`;

    tsContent += importStatements;
    tsContent += `export type InputMap = {\n`;

    // Iterate over each endpoint in endpointMapData to build the InputMap
    // type
    for (const endpoint of Object.keys(endPointMap)) {
        if (inputMap.hasOwnProperty(endpoint)) {
            const inputs = inputMap[endpoint];
            tsContent += `  "${endpoint}": {\n`;

            if (inputs.query) {
                tsContent += `    query: ${inputs.query};\n`;
            }

            if (inputs.params) {
                tsContent += `    params: ${inputs.params};\n`;
            }

            if (inputs.body) {
                tsContent += `    body: ${inputs.body};\n`;
            }

            tsContent += `  };\n`;
        } else {
            // No inputs for this endpoint
            tsContent += `  "${endpoint}": {};\n`;
        }
    }

    tsContent += `};\n\n`;
    tsContent += `export default InputMap;\n`;

    // Write to inputMap.ts
    try {
        fs.writeFileSync(outputPath, tsContent, "utf-8");
        console.log(`Successfully generated ${outputPath}`);
    } catch (err) {
        console.error(`Error writing to ${outputPath}:`, err);
        process.exit(1);
    }
};
