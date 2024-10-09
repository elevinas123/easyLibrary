import * as fs from "fs";
import * as path from "path";
import { Project, SourceFile } from "ts-morph";
import { Plugin } from "vite";
import * as ts from "typescript";
export default function backendPlugin(): Plugin {
    const outputDir = "../backend/src/backend-dist";
    const processedFiles = new Set<string>();
    let project: Project;

    return {
        name: "vite-plugin-backend",
        async buildStart() {
            // Clean the output directory
            await fs.promises.rm(outputDir, { recursive: true, force: true });
            await fs.promises.mkdir(outputDir, { recursive: true });

            // Initialize the ts-morph Project with compiler options
            project = new Project({
                compilerOptions: {
                    target: ts.ScriptTarget.ES2020, // Target modern JS
                    module: ts.ModuleKind.ESNext, // Use modern module system
                    jsx: ts.JsxEmit.React, // For handling React JSX
                    moduleResolution: ts.ModuleResolutionKind.NodeJs,
                    experimentalDecorators: true, // Enable decorators
                    emitDecoratorMetadata: false, // Disable metadata if not needed
                    allowJs: true,
                    esModuleInterop: true,
                    skipLibCheck: true,
                    forceConsistentCasingInFileNames: true,
                },
            });

            // Define the directory to scan for backend files
            const backendSrcDir = path.resolve("src"); // Adjust this path as needed

            // Get all .ts, .tsx, .js, .jsx files in the backendSrcDir
            const backendFiles = await getAllFiles(backendSrcDir, [
                ".ts",
                ".tsx",
                ".js",
                ".jsx",
            ]);

            // Filter files that contain "use backend" or "use server"
            const filesToProcess: string[] = [];
            for (const file of backendFiles) {
                const content = await fs.promises.readFile(file, "utf8");
                if (
                    content.includes('"use backend"') ||
                    content.includes('"use server"')
                ) {
                    filesToProcess.push(file);
                }
            }

            // Process each backend file with the markers
            for (const file of filesToProcess) {
                await processFile(file);
            }
        },
        async transform(code, id) {
            // Only process .ts, .tsx, .js, .jsx files, excluding node_modules
            if (!/\.(t|j)sx?$/.test(id) || id.includes("node_modules")) {
                return null;
            }

            // Check for markers in the code
            if (
                code.includes('"use backend"') ||
                code.includes('"use server"')
            ) {
                await processFile(id);
            }

            return null;
        },
    };

    // Helper function to recursively get all files with specified extensions
    async function getAllFiles(dir: string, exts: string[]): Promise<string[]> {
        let results: string[] = [];
        const list = await fs.promises.readdir(dir, { withFileTypes: true });
        for (const dirent of list) {
            const res = path.resolve(dir, dirent.name);
            if (dirent.isDirectory()) {
                results = results.concat(await getAllFiles(res, exts));
            } else {
                if (exts.includes(path.extname(dirent.name))) {
                    results.push(res);
                }
            }
        }
        return results;
    }

    async function processFile(filePath: string) {
        if (processedFiles.has(filePath)) {
            return;
        }
        processedFiles.add(filePath);

        if (!fs.existsSync(filePath)) {
            console.error(`[vite-plugin-backend] File not found: ${filePath}`);
            return;
        }

        // Read the file content
        const code = await fs.promises.readFile(filePath, "utf8");

        // Check if the source file already exists in the project
        let sourceFile: SourceFile;
        if (project.getSourceFile(filePath)) {
            // Update the source file with new content
            sourceFile = project.getSourceFileOrThrow(filePath);
            sourceFile.replaceWithText(code);
        } else {
            // Create the source file, allowing overwrite
            sourceFile = project.createSourceFile(filePath, code, {
                overwrite: true,
            });
        }

        // Process import declarations
        const importDeclarations = sourceFile.getImportDeclarations();

        for (const importDecl of importDeclarations) {
            const moduleSpecifier = importDecl.getModuleSpecifierValue();
            if (moduleSpecifier.startsWith(".")) {
                console.log("moduleSpecifier", moduleSpecifier);
                // Resolve the imported file path
                const importedFilePath = path.resolve(
                    path.dirname(filePath),
                    moduleSpecifier
                );

                // Try possible file extensions and index files
                const possibleFiles = [
                    importedFilePath,
                    importedFilePath + ".ts",
                    importedFilePath + ".tsx",
                    importedFilePath + ".js",
                    importedFilePath + ".jsx",
                    path.join(importedFilePath, "index.ts"),
                    path.join(importedFilePath, "index.tsx"),
                    path.join(importedFilePath, "index.js"),
                    path.join(importedFilePath, "index.jsx"),
                ];
                let fullImportedFilePath = "";

                for (const candidatePath of possibleFiles) {
                    if (fs.existsSync(candidatePath)) {
                        fullImportedFilePath = candidatePath;
                        break;
                    }
                }

                if (!fullImportedFilePath) {
                    console.error(`[vite-plugin-backend] Imported file not found:
                            ${importedFilePath} with possible extensions`);
                    continue;
                }

                // Recursively process the imported file
                await processFile(fullImportedFilePath);
            }
        }

        // Skip transpiling and simply copy the TypeScript file to the output
        // directory
        const outputFilePath = path.join(outputDir, path.basename(filePath));

        // Adjust import paths in the file content
        const adjustedCode = adjustImportsForFlattenedStructure(code, filePath);

        // Write the adjusted code to the output directory
        await fs.promises.writeFile(outputFilePath, adjustedCode, "utf8");

        console.log(
            `[vite-plugin-backend] Processed and copied ${filePath} to ${
                outputFilePath
            }`
        );
    }

    /**
     * Adjusts import paths in the emitted code to match the flattened output
     * structure. It replaces relative import paths with the corresponding
     * flattened filenames.
     *
     * @param code The TypeScript code to modify.
     * @param sourceFilePath The path to the source file.
     * @returns The modified TypeScript code with adjusted import paths.
     */
    function adjustImportsForFlattenedStructure(
        code: string,
        sourceFilePath: string
    ): string {
        // Use ts-morph to parse the emitted code
        const tempSourceFile = project.createSourceFile("temp.ts", code, {
            overwrite: true,
        });

        const importDeclarations = tempSourceFile.getImportDeclarations();

        for (const importDecl of importDeclarations) {
            const moduleSpecifier = importDecl.getModuleSpecifierValue();
            if (
                moduleSpecifier.startsWith(".") ||
                moduleSpecifier.startsWith("src")
            ) {
                // Resolve the original imported file path
                const importedFilePath = path.resolve(
                    path.dirname(sourceFilePath),
                    moduleSpecifier
                );
                // Trim the full path to just the filename and append .ts
                const importedFileName =
                    importedFilePath.replace(/^.*[\\/]/, "") ;

                console.log("importedFileName", importedFileName);

                // Update the import path to point to the flattened file
                importDecl.setModuleSpecifier(`./${importedFileName}`);
            }
        }

        return tempSourceFile.getFullText();
    }
}
