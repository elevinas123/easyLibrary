// backend/generate-types.ts

import * as fs from "fs";
import * as path from "path";

/**
 * Function to traverse upwards from a starting directory to find a directory
 * with a given name.
 * @param startDir - The directory to start searching from.
 * @param targetDirName - The name of the directory to find.
 * @returns The absolute path to the target directory if found; otherwise, null.
 */
const findDirectoryUpwards = (
    startDir: string,
    targetDirName: string
): string | null => {
    let currentDir = path.resolve(startDir);

    while (true) {
        const potentialPath = path.join(currentDir, targetDirName);
        if (
            fs.existsSync(potentialPath) &&
            fs.lstatSync(potentialPath).isDirectory()
        ) {
            return potentialPath;
        }

        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) {
            // Reached the root directory without finding the target
            break;
        }
        currentDir = parentDir;
    }

    return null;
};

/**
 * Main function to generate TypeScript interfaces from types.json
 */
const generateTypes = () => {
    // Step 1: Retrieve the frontend directory name from the environment variable
    const frontendDirName = process.env.FRONTEND_DIR || "frontend";
    console.log(`Frontend directory name to locate: "${frontendDirName}"`);

    // Step 2: Find the frontend directory path by searching upwards from the
    // current script's directory
    const scriptDir = __dirname;
    const frontendDirPath = findDirectoryUpwards(scriptDir, frontendDirName);

    if (!frontendDirPath) {
        console.error(
            `Error: Unable to locate a directory named "${
                frontendDirName
            }" from "${scriptDir}".`
        );
        console.error(
            `Please ensure that the frontend directory exists and is named correctly.`
        );
        process.exit(1); // Exit the script with an error code
    }

    console.log(`Frontend directory found at: "${frontendDirPath}"`);

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

    // Step 4: Define paths to types.json and the output types.ts
    const typesJsonPath = path.resolve(__dirname, "./types.json");
    const typesTsPath = path.join(endPointTypesDir, "types.ts");

    // Step 5: Verify that types.json exists
    if (!fs.existsSync(typesJsonPath)) {
        console.error(
            `Error: types.json not found at path: "${typesJsonPath}"`
        );
        process.exit(1); // Exit the script with an error code
    }

    // Step 6: Read and parse types.json
    let typesJson: Record<string, any>;
    try {
        const typesJsonContent = fs.readFileSync(typesJsonPath, "utf-8");
        typesJson = JSON.parse(typesJsonContent);
    } catch (err) {
        console.error(`Error reading or parsing "${typesJsonPath}":`, err);
        process.exit(1); // Exit the script with an error code
    }

    // Step 7: Function to convert a single type entry to a TypeScript interface
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

// Execute the main function
generateTypes();
