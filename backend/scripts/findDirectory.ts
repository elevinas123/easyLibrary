import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

export const getSourceDirectory = (): string => {
    const tsconfigPath = path.resolve(__dirname, "..", "tsconfig.json");

    if (!fs.existsSync(tsconfigPath)) {
        console.warn(
            `tsconfig.json not found at ${tsconfigPath}. Defaulting to 'src/'.`
        );
        return "src";
    }

    const tsconfigFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
    if (tsconfigFile.error) {
        console.error(
            "Error reading tsconfig.json:",
            tsconfigFile.error.messageText
        );
        return "src";
    }

    const parsedConfig = ts.parseJsonConfigFileContent(
        tsconfigFile.config,
        ts.sys,
        path.dirname(tsconfigPath)
    );

    if (parsedConfig.options.rootDir) {
        return parsedConfig.options.rootDir;
    } else {
        console.warn(
            "rootDir not specified in tsconfig.json. Defaulting to 'src/'."
        );
        return "src";
    }
};
export const findDirectoryUpwards = (): string | null => {
    const scriptDir = __dirname;
    let currentDir = path.resolve(scriptDir);

    const frontendDirName = process.env.FRONTEND_DIR || "frontend";
    console.log(`Frontend directory name to locate: "${frontendDirName}"`);

    // Step 2: Find the frontend directory path by searching upwards from the
    // current script's directory
    let frontendDirPath: string | null = null;
    while (true) {
        const potentialPath = path.join(currentDir, frontendDirName);
        if (
            fs.existsSync(potentialPath) &&
            fs.lstatSync(potentialPath).isDirectory()
        ) {
            frontendDirPath = potentialPath;
            break;
        }

        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) {
            // Reached the root directory without finding the target
            break;
        }
        currentDir = parentDir;
    }

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

    return frontendDirPath;
};
