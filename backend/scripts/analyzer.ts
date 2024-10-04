// type-generator.ts
import * as fs from "fs";
import { glob } from "glob";
import * as path from "path";
import * as ts from "typescript";

import { getControllerPath } from "./extract";
import {
    extractArrayType,
    extractInnerType,
    extractUnionTypes,
} from "./extractType";
import { getSourceDirectory } from "./findDirectory";
import { generateEndPointTypes } from "./generateEndPointTypes";
import { generateInputTypes } from "./generateInputTypes";
import { generateTypes } from "./generateTypes";
import {
    serializeClass,
    serializeEnum,
    serializeInterface,
    serializeTypeAlias,
} from "./serialize";

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
    extends?: string[];
}

export interface ParamEntry {
    name: string;
    type: string;
    decorator: string;
}
export type InputMapping = {
    [key: string]: { query?: string; params?: string; body?: string };
};
interface PropertyEntry {
    name: string;
    type: string;
}

// Type dictionary to store type definitions
// Type dictionary to store type and interface definitions
export type TypeDict = {
    [key: string]: {
        isType: boolean; // Whether this entry is a `type` (true) or `interface`
        // (false)
        name: string;
        properties?: { name: string; type: string; fullType: string }[]; // Only for interfaces
        type?: string; // Only for types
        extends?: string[]; // Only for interfaces
    };
};

// Endpoint mapping to associate API endpoints with their return types
export type EndpointMapping = {
    [key: string]: string; // e.g., "GET /books": "Book[]"
};

// List of simple types to recognize
export const basicTypes = [
    "string",
    "number",
    "boolean",
    "Date",
    "any",
    "void",
    "null",
    null,
    undefined,
    "undefined",
    "never",
    "unknown",
];

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
// Fill documentation with type details, handling generics, arrays, and union
const fillDoc = (
    doc: DocEntry[],
    currentType: DocEntry,
    typeDict: TypeDict,
    processedTypes: Set<string> = new Set() // Track processed types
): TypeDict => {
    if (!currentType.name || (!currentType.properties && !currentType.type)) {
        return typeDict;
    }
    if (currentType.name === "StartType") {
        console.log("currentType", currentType);
    }

    // Prevent duplicate type definitions or circular processing
    if (processedTypes.has(currentType.name)) {
        return typeDict;
    }
    processedTypes.add(currentType.name);

    let properties = currentType.properties ? [...currentType.properties] : [];

    // Handle `extends` in interfaces
    if (currentType.extends) {
        currentType.extends.forEach((parentName: string) => {
            const parentInterface = doc.find(
                (entry) => entry.name === parentName
            );
            if (parentInterface) {
                // Recursively process the parent interface
                typeDict = fillDoc(
                    doc,
                    parentInterface,
                    typeDict,
                    processedTypes
                );
            } else {
                console.warn(
                    `Parent interface "${
                        parentName
                    }" not found in documentation.`
                );
            }
        });
    }

    if (properties.length > 0) {
        // **Existing logic**: Process properties if they exist (interfaces)
        const processedProperties = properties.map((property) => {
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
                if (currentType.name === "StartType") {
                    console.log("ut", ut);
                }
                if (/^".*"$/.test(ut)) {
                    // String literal type (e.g., "bookText" or "text")
                    typeStrings.push(ut);
                } else if (basicTypes.includes(ut)) {
                    // Basic types like string, number, etc.
                    typeStrings.push(ut);
                } else {
                    // Check if the type exists in the doc
                    const referencedType = doc.find(
                        (entry) => entry.name === ut
                    );
                    if (referencedType) {
                        // Recursively process referenced type
                        typeDict = fillDoc(
                            doc,
                            referencedType,
                            typeDict,
                            processedTypes
                        );
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
                optional: property.optional,
            };
        });

        typeDict[currentType.name] = {
            isType: false, // This is an interface
            name: currentType.name,
            properties: processedProperties,
            extends: currentType.extends,
        };
    } else if (currentType.type) {
        // **New logic**: Handle cases where there are no properties, but the
        // type is a union (for types)
        const unionTypes = extractUnionTypes(currentType.type);
        const typeStrings: string[] = [];

        unionTypes.forEach((ut) => {
            if (currentType.name === "StartType") {
                console.log("ut", ut);
            }
            if (/^".*"$/.test(ut)) {
                // String literal type (e.g., "bookText" or "text")
                typeStrings.push(ut);
            } else if (basicTypes.includes(ut)) {
                // Basic types like string, number, etc.
                typeStrings.push(ut);
            } else {
                // Check if the type exists in the doc
                const referencedType = doc.find((entry) => entry.name === ut);
                if (
                    referencedType &&
                    referencedType.name &&
                    !processedTypes.has(referencedType.name)
                ) {
                    // Recursively process referenced type
                    typeDict = fillDoc(
                        doc,
                        referencedType,
                        typeDict,
                        processedTypes
                    );
                } else {
                    console.warn(
                        `Referenced type "${ut}" not found in documentation.`
                    );
                }
                typeStrings.push(ut);
            }
        });

        typeDict[currentType.name] = {
            isType: true, // This is a type alias
            name: currentType.name,
            type: typeStrings.join(" | "),
        };
    }

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
                    if (!basicTypes.includes(put)) {
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
            const formattedControllerPath = controller.path?.startsWith("/")
                ? controller.path
                : `/${controller.path}`;

            const formattedMethodPath = method.methodPath
                ? method.methodPath.startsWith("/")
                    ? method.methodPath
                    : `/${method.methodPath}`
                : "";

            const endpointKey = `${method.httpMethod?.toUpperCase()} ${
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

    // Replace ObjectId types in typeDict with string and handle `isType` flag
    for (const key in typeDict) {
        if (typeDict[key].isType) {
            // If it's a type alias, map it to string and preserve its type alias
            // structure
            typeDict[key].type = mapType(typeDict[key].type!);
        } else if (typeDict[key].properties) {
            // If it's an interface, map ObjectId types in properties to string
            typeDict[key].properties = typeDict[key].properties!.map(
                (typeDef) => ({
                    ...typeDef,
                    type: mapType(typeDef.type),
                })
            );
        }
    }

    return { typeDict, endpointMap, inputMap };
};
const generateDocumentation = (
    fileNames: string[],
    configFileName: string = "tsconfig.json"
): void => {
    // Resolve the path to tsconfig.json
    const configPath = ts.findConfigFile(
        /*searchPath*/ "./",
        ts.sys.fileExists,
        configFileName
    );

    if (!configPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }

    // Read and parse the tsconfig.json
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);

    if (configFile.error) {
        const errorMessage = ts.flattenDiagnosticMessageText(
            configFile.error.messageText,
            "\n"
        );
        throw new Error(`Error reading tsconfig.json: ${errorMessage}`);
    }

    // Parse the JSON to get compiler options
    const parsedCommandLine = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        path.dirname(configPath)
    );

    if (parsedCommandLine.errors.length > 0) {
        const errorMessage = ts.flattenDiagnosticMessageText(
            parsedCommandLine.errors[0].messageText,
            "\n"
        );
        throw new Error(`Error parsing tsconfig.json: ${errorMessage}`);
    }

    // Create the TypeScript program with the parsed options
    const program = ts.createProgram({
        rootNames: parsedCommandLine.fileNames,
        options: parsedCommandLine.options,
    });

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
    const { typeDict, endpointMap, inputMap } = createTsType(output);

    generateTypes(typeDict);
    generateInputTypes(inputMap, endpointMap);
    generateEndPointTypes(endpointMap);

    // Function to visit nodes in the AST
    function visit(node: ts.Node) {
        if (!isNodeExported(node)) {
            return;
        }

        // Handle Class Declarations
        if (ts.isClassDeclaration(node) && node.name) {
            const symbol = checker.getSymbolAtLocation(node.name);
            if (symbol) {
                const controllerPath = getControllerPath(node);
                output.push(serializeClass(symbol, checker, controllerPath));
            }
        }

        // Handle Interface Declarations
        else if (ts.isInterfaceDeclaration(node) && node.name) {
            const symbol = checker.getSymbolAtLocation(node.name);
            if (symbol) {
                output.push(serializeInterface(symbol, checker));
            }
        }

        // Handle Type Alias Declarations
        else if (ts.isTypeAliasDeclaration(node) && node.name) {
            const symbol = checker.getSymbolAtLocation(node.name);
            if (symbol) {
                output.push(serializeTypeAlias(symbol, checker));
            }
        }

        // Handle Enum Declarations (optional)
        else if (ts.isEnumDeclaration(node) && node.name) {
            const symbol = checker.getSymbolAtLocation(node.name);
            if (symbol) {
                output.push(serializeEnum(symbol, checker));
            }
        }

        // Continue traversing child nodes
        ts.forEachChild(node, visit);
    }
};

const generateAllDocumentation = async () => {
    const sourceDir = getSourceDirectory();
    const pattern = path.join(sourceDir, "**", "*.ts"); // Include all TypeScript files

    try {
        const files = await glob(pattern, {
            absolute: true,
            ignore: ["**/__tests__/**", "**/*.spec.ts", "**/*.test.ts"],
        });

        if (files.length === 0) {
            console.warn(
                "No controller files found. Please check the source directory and glob pattern."
            );
            return;
        }

        generateDocumentation(files); // tsconfig.json is loaded within generateDocumentation

        console.log("Documentation generated successfully.");
    } catch (err) {
        console.error("Error finding controller files:", err);
    }
};

// Execute the function to generate documentation for all controllers
generateAllDocumentation();
