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
