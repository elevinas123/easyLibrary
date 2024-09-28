// type-generator.ts

import * as fs from "fs";
import { glob } from "glob";
import * as path from "path";
import * as ts from "typescript";
import {
    getControllerPath
} from "./extract";
import {
    extractArrayType,
    extractInnerType,
    extractUnionTypes,
} from "./extractType";
import { getSourceDirectory } from "./getSourceDirectory";
import { serializeClass } from "./serialize";

// Define the structure for documentation entries

export interface DocEntry {
    name?: string;
    fileName?: string;
    documentation?: string;
    type?: string;
    constructors?: DocEntry[];
    parameters?: any;
    returnType?: string;
    methods?: DocEntry[];
    properties?: any;
    path?: string;
    methodPath?: string;
    httpMethod?: string; // GET, POST, etc.
    decorators?: any;
}

export interface ParamEntry {
    name: string;
    type: string;
    decorator: string;
}
type InputMapping = {
    [key: string]: { query?: string; params?: string; body?: string };
};
interface PropertyEntry {
    name: string;
    type: string;
}

// Type dictionary to store type definitions
type TypeDict = {
    [key: string]: { name: string; type: string; fullType: string }[];
};

// Endpoint mapping to associate API endpoints with their return types
type EndpointMapping = {
    [key: string]: string; // e.g., "GET /books": "Book[]"
};

// List of simple types to recognize
const simpleTypes = ["string", "number", "boolean", "Date", "any"];

// Function to check if a node is exported
function isNodeExported(node: ts.Node): boolean {
    return (
        (ts.getCombinedModifierFlags(node as ts.Declaration) &
            ts.ModifierFlags.Export) !==
            0 ||
        (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    );
}

// Fill documentation with type details, handling generics, arrays, and union
// types
const fillDoc = (
    doc: DocEntry[],
    currentType: DocEntry,
    typeDict: TypeDict
): TypeDict => {
    if (!currentType.name || !currentType.properties) {
        return typeDict;
    }

    // Prevent duplicate type definitions
    if (typeDict[currentType.name]) {
        return typeDict;
    }

    const processedProperties = currentType.properties.map((property) => {
        // Handle generics like Promise<T>
        let innerType = extractInnerType(property.type);
        // Handle arrays like T[]
        let isArray = false;
        if (innerType.endsWith("[]")) {
            isArray = true;
            innerType = extractArrayType(innerType);
        }

        // Handle union types like (TypeA | TypeB)
        const unionTypes = extractUnionTypes(innerType);
        const typeStrings: string[] = [];

        unionTypes.forEach((ut) => {
            if (simpleTypes.includes(ut)) {
                typeStrings.push(ut);
            } else {
                // Check if the type exists in doc
                const referencedType = doc.find((entry) => entry.name === ut);
                if (referencedType) {
                    // Recursively process referenced type
                    typeDict = fillDoc(doc, referencedType, typeDict);
                } else {
                    console.warn(
                        `Referenced type "${ut}" not found in documentation.`
                    );
                }
                typeStrings.push(ut);
            }
        });

        // Reconstruct the type string
        let fullType = typeStrings.join(" | ");
        if (isArray) {
            fullType += "[]";
        }

        return {
            name: property.name,
            type: isArray
                ? `${innerType}[]`
                : unionTypes.length > 1
                  ? `(${typeStrings.join(" | ")})`
                  : innerType,
            fullType: `${property.name}: ${fullType}`,
        };
    });

    typeDict[currentType.name] = processedProperties;
    return typeDict;
};

// Updated helper to map ObjectId to string
const mapType = (type: string): string => {
    if (type === "Types.ObjectId" || type === "ObjectId") {
        return "string";
    }
    // Add more mappings if needed
    return type;
};

const createTsType = (
    doc: DocEntry[]
): {
    typeDict: TypeDict;
    endpointMap: EndpointMapping;
    inputMap: InputMapping;
} => {
    const controllers = doc.filter(
        (entry) => entry.path && entry.path.length > 0
    );
    if (controllers.length === 0) {
        console.warn("No controllers found with paths.");
        return { typeDict: {}, endpointMap: {}, inputMap: {} };
    }

    let typeDict: TypeDict = {};
    let endpointMap: EndpointMapping = {};
    let inputMap: InputMapping = {};

    controllers.forEach((controller) => {
        controller.methods?.forEach((method) => {
            if (!method.name || !method.returnType) return;

            // Extract the inner return type if it's a generic type like Promise<>
            let returnInnerType = extractInnerType(method.returnType);
            let isReturnArray = false;
            if (returnInnerType.endsWith("[]")) {
                isReturnArray = true;
                returnInnerType = extractArrayType(returnInnerType);
            }

            // Handle union types for return type
            const returnUnionTypes = extractUnionTypes(returnInnerType);
            returnUnionTypes.forEach((ut) => {
                const typeEntry = doc.find((entry) => entry.name === ut);
                if (typeEntry) {
                    typeDict = fillDoc(doc, typeEntry, typeDict);
                } else {
                    console.warn(
                        `Return type "${ut}" not found in documentation.`
                    );
                }
            });

            // **Process Input Parameters**
            const inputTypes: {
                query?: string;
                params?: string;
                body?: string;
            } = {};

            method.parameters?.forEach((param: any) => {
                const decorator = param.decorator;
                const paramTypeOriginal = param.type;
                const paramType = mapType(paramTypeOriginal); // Apply type mapping

                // Handle union types for parameter types
                const paramUnionTypes = extractUnionTypes(paramTypeOriginal);
                paramUnionTypes.forEach((put) => {
                    if (!simpleTypes.includes(put)) {
                        // Only add complex types
                        const mappedType = mapType(put);
                        const typeEntry = doc.find(
                            (entry) => entry.name === put
                        );
                        if (typeEntry) {
                            typeDict = fillDoc(doc, typeEntry, typeDict);
                        } else {
                            console.warn(
                                `Parameter type "${put}" not found in documentation.`
                            );
                        }
                    }
                });

                if (decorator === "Query") {
                    // Handle multiple query parameters by merging into one object
                    inputTypes.query = inputTypes.query
                        ? `${inputTypes.query} & { ${param.name}: ${paramType} }`
                        : `{ ${param.name}: ${paramType} }`;
                } else if (decorator === "Param") {
                    // Handle multiple path parameters by merging into one object
                    inputTypes.params = inputTypes.params
                        ? `${inputTypes.params} & { ${param.name}: ${paramType} }`
                        : `{ ${param.name}: ${paramType} }`;
                } else if (decorator === "Body") {
                    // Assuming only one body parameter per endpoint
                    inputTypes.body = inputTypes.body
                        ? `${inputTypes.body} & ${paramType}`
                        : paramType;
                }
            });

            // **Formatted Endpoint Key Generation**
            const formattedControllerPath = controller.path.startsWith("/")
                ? controller.path
                : `/${controller.path}`;

            const formattedMethodPath = method.methodPath
                ? method.methodPath.startsWith("/")
                    ? method.methodPath
                    : `/${method.methodPath}`
                : "";

            const endpointKey = `${method.httpMethod.toUpperCase()} ${
                formattedControllerPath
            }${formattedMethodPath}`;

            // Assign the inner return type without Promise<>
            const responseType = isReturnArray
                ? `${returnInnerType}[]`
                : returnInnerType;

            // Assign to endpointMap
            endpointMap[endpointKey] = responseType;

            // Assign to inputMap if there are input types
            if (inputTypes.query || inputTypes.params || inputTypes.body) {
                inputMap[endpointKey] = {
                    ...(inputTypes.query && { query: inputTypes.query }),
                    ...(inputTypes.params && { params: inputTypes.params }),
                    ...(inputTypes.body && { body: inputTypes.body }),
                };
            }
        });
    });

    // Replace ObjectId types in typeDict with string
    for (const key in typeDict) {
        typeDict[key] = typeDict[key].map((typeDef) => ({
            ...typeDef,
            type: mapType(typeDef.type),
        }));
    }

    fs.writeFileSync(
        path.join(__dirname, "./types.json"),
        JSON.stringify(typeDict, undefined, 4)
    );
    fs.writeFileSync(
        path.join(__dirname, "./endPointMap.json"),
        JSON.stringify(endpointMap, undefined, 4)
    );
    fs.writeFileSync(
        path.join(__dirname, "./inputMap.json"),
        JSON.stringify(inputMap, undefined, 4)
    );
    return { typeDict, endpointMap, inputMap };
};
// Create TypeScript types and endpoint mappings
const generateDocumentation = (
    fileNames: string[],
    options: ts.CompilerOptions
): void => {
    const program = ts.createProgram(fileNames, options);
    const checker = program.getTypeChecker();
    const output: DocEntry[] = [];

    // Process each source file
    for (const sourceFile of program.getSourceFiles()) {
        const filePath = sourceFile.fileName;

        // Filter out files from node_modules and .d.ts files
        if (filePath.includes("node_modules") || sourceFile.isDeclarationFile) {
            continue;
        }

        ts.forEachChild(sourceFile, visit);
    }

    // Generate TypeScript types and endpoint mapping from the collected
    // documentation
    const { typeDict, endpointMap } = createTsType(output);

    // Function to visit nodes in the AST
    function visit(node: ts.Node) {
        if (!isNodeExported(node)) {
            return;
        }

        if (ts.isClassDeclaration(node) && node.name) {
            const symbol = checker.getSymbolAtLocation(node.name);
            if (symbol) {
                const controllerPath = getControllerPath(node);
                output.push(serializeClass(symbol, checker, controllerPath));
            }
        }
    }
};

const generateAllDocumentation = async () => {
    / /;
    const sourceDir = getSourceDirectory();
    const pattern = path.join(sourceDir, "**", "*.controller.ts"); // Constructed pattern

    console.log(`Using source directory: ${sourceDir}`);
    console.log(`Glob pattern: ${pattern}`);

    try {
        const files = await glob(pattern, {
            absolute: true,
            ignore: ["**/__tests__/**", "**/*.spec.ts", "**/*.test.ts"],
        });
        console.log("Processing files:", files);
        generateDocumentation(files, {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
        });

        if (files.length === 0) {
            console.warn(
                "No controller files found. Please check the source directory and glob pattern."
            );
            return;
        }

        console.log("Documentation generated successfully.");
    } catch (err) {
        console.error("Error finding controller files:", err);
    }
};
// Execute the function to generate documentation for all controllers
generateAllDocumentation();
