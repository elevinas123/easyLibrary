// backend/generate-types.ts

import * as fs from "fs";
import * as path from "path";
import { TypeDict } from "./analyzer";
import { findDirectoryUpwards } from "./findDirectory";

/**
 * Function to traverse upwards from a starting directory to find a directory
 * with a given name.
 * @param startDir - The directory to start searching from.
 * @param targetDirName - The name of the directory to find.
 * @returns The absolute path to the target directory if found; otherwise, null.
 */

/**
 * Main function to generate TypeScript interfaces from types.json
 */
export const generateTypes = (typesDict: TypeDict) => {
    // Step 1: Retrieve the frontend directory name from the environment
    // variable

    const frontendDirPath = findDirectoryUpwards();
    // Step 3: Define the path to the frontend's endPointTypes directory
    const endPointTypesDir = path.join(frontendDirPath, "src", "endPointTypes");

    // Ensure that the endPointTypes directory exists; create it if it doesn't
    if (!fs.existsSync(endPointTypesDir)) {
        try {
            fs.mkdirSync(endPointTypesDir, { recursive: true });
            console.log(`Created directory: "${endPointTypesDir}"`);
        } catch (err) {
            console.error(
                `Error creating directory "${endPointTypesDir}":`,
                err
            );
            process.exit(1); // Exit the script with an error code
        }
    }

    const typesTsPath = path.join(endPointTypesDir, "types.ts");

    // Step 6: Read and parse types.json
    let typesJson = typesDict;

    // Step 7: Function to convert a single type entry to a TypeScript
    // interface
    const convertTypeToInterface = (typeName: string, properties: any[]) => {
        let interfaceStr = `export interface ${typeName} {\n`;
        properties.forEach((prop: any) => {
            // Handle optional properties
            const optionalFlag = prop.optional ? "?" : "";
            interfaceStr += `  ${prop.name}${optionalFlag}: ${prop.type};\n`;
        });
        interfaceStr += `}\n\n`;
        return interfaceStr;
    };

    // Step 8: Generate TypeScript interfaces
    let typesTsContent = `// This file is auto-generated from types.json. Do not modify manually.\n\n`;

    for (const [typeName, properties] of Object.entries(typesJson)) {
        // Validate that properties is an array
        if (!Array.isArray(properties)) {
            console.warn(
                `Warning: Properties for type "${
                    typeName
                }" should be an array. Skipping this type.`
            );
            continue;
        }

        typesTsContent += convertTypeToInterface(typeName, properties);
    }

    // Step 9: Handle custom types if necessary (e.g., StartType, ObjectId)
    // You can expand this section based on your project's requirements
    typesTsContent += `export type ObjectId = string;\n`;

    // Step 10: Write the generated content to types.ts
    try {
        fs.writeFileSync(typesTsPath, typesTsContent, "utf-8");
        console.log(`Successfully generated "${typesTsPath}"`);
    } catch (err) {
        console.error(`Error writing to "${typesTsPath}":`, err);
        process.exit(1); // Exit the script with an error code
    }
};
