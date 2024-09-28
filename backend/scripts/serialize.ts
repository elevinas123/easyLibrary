// Function to serialize a class symbol into DocEntry
import * as ts from "typescript";

import {
    getControllerPath,
    getHttpMethod,
    getMethodPath,
    getParameterDecorator,
} from "./extract";
import { DocEntry, ParamEntry } from "./analyzer";
export function serializeClass(
    symbol: ts.Symbol,
    checker: ts.TypeChecker,
    controllerPath?: string
): DocEntry {
    const details: DocEntry = {
        name: symbol.getName(),
        documentation: ts.displayPartsToString(
            symbol.getDocumentationComment(checker)
        ),
        type: checker.typeToString(
            checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
        ),
        extends: [], // Add extends property to DocEntry to track inheritance
        properties: [],
        methods: [],
        constructors: [],
    };

    const classDeclaration = symbol.valueDeclaration as ts.ClassDeclaration;

    // Serialize constructors
    const classType = checker.getDeclaredTypeOfSymbol(symbol);
    details.constructors = classType
        .getConstructSignatures()
        .map(serializeSignature(checker));

    details.path = controllerPath || ""; // Add controller path

    // Serialize properties and check if they are optional (directly declared
    // properties only)
    if (classDeclaration.members) {
        classDeclaration.members.forEach((member) => {
            if (ts.isPropertyDeclaration(member)) {
                const memberSymbol = checker.getSymbolAtLocation(member.name);
                if (memberSymbol) {
                    const propType = checker.getTypeOfSymbolAtLocation(
                        memberSymbol,
                        member
                    );
                    const isOptional = !!member.questionToken;
                    details.properties.push({
                        name: memberSymbol.getName(),
                        type: checker.typeToString(propType),
                        optional: isOptional,
                        documentation: ts.displayPartsToString(
                            memberSymbol.getDocumentationComment(checker)
                        ),
                    });
                }
            }
        });
    }

    // Serialize methods (directly declared methods only)
    classDeclaration.members.forEach((member) => {
        if (ts.isMethodDeclaration(member)) {
            const methodSymbol = checker.getSymbolAtLocation(member.name);
            if (methodSymbol) {
                details.methods.push(
                    serializeMethod(methodSymbol, checker, classType)
                );
            }
        }
    });

    // Handle class inheritance (extends)
    if (classDeclaration.heritageClauses) {
        classDeclaration.heritageClauses.forEach((clause) => {
            if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                clause.types.forEach((typeNode) => {
                    const extendsType = checker.getTypeAtLocation(typeNode);
                    details.extends.push(checker.typeToString(extendsType));
                });
            }
        });
    }

    return details;
}

// Function to serialize a method symbol into DocEntry
function serializeMethod(
    symbol: ts.Symbol,
    checker: ts.TypeChecker,
    classType: ts.Type
): DocEntry {
    const methodType = checker.getTypeOfSymbolAtLocation(
        symbol,
        symbol.valueDeclaration!
    );
    const methodDeclaration = symbol.valueDeclaration as ts.MethodDeclaration;

    const httpMethod = getHttpMethod(methodDeclaration);
    const methodPath = getMethodPath(methodDeclaration) || "";
    const parameters = methodType
        .getCallSignatures()[0]
        ?.parameters.map((param) => {
            return serializeParameter(param, checker, methodDeclaration);
        });

    return {
        name: symbol.getName(),
        documentation: ts.displayPartsToString(
            symbol.getDocumentationComment(checker)
        ),
        parameters,
        returnType: checker.typeToString(
            methodType.getCallSignatures()[0].getReturnType()
        ),
        methodPath,
        httpMethod, // HTTP method: GET, POST, etc.
    };
}

// Function to serialize method parameters, including handling optional

// Function to serialize a symbol into DocEntry
function serializeSymbol(symbol: ts.Symbol, checker: ts.TypeChecker): DocEntry {
    return {
        name: symbol.getName(),
        documentation: ts.displayPartsToString(
            symbol.getDocumentationComment(checker)
        ),
        type: checker.typeToString(
            checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
        ),
    };
}

// Function to serialize a signature into DocEntry
function serializeSignature(checker: ts.TypeChecker) {
    return (signature: ts.Signature): DocEntry => ({
        parameters: signature.parameters.map((param) =>
            serializeSymbol(param, checker)
        ),
        returnType: checker.typeToString(signature.getReturnType()),
        documentation: ts.displayPartsToString(
            signature.getDocumentationComment(checker)
        ),
    });
}

// Function to serialize a parameter symbol into ParamEntry
function serializeParameter(
    paramSymbol: ts.Symbol,
    checker: ts.TypeChecker,
    methodDeclaration: ts.MethodDeclaration
): ParamEntry {
    const paramDecorator = getParameterDecorator(
        methodDeclaration,
        paramSymbol
    );
    return {
        name: paramSymbol.getName(),
        type: checker.typeToString(
            checker.getTypeOfSymbolAtLocation(
                paramSymbol,
                paramSymbol.valueDeclaration!
            )
        ),
        decorator: paramDecorator || "Unknown",
    };
}
export function serializeInterface(
    symbol: ts.Symbol,
    checker: ts.TypeChecker
): DocEntry {
    const details: DocEntry = {
        name: symbol.getName(),
        documentation: ts.displayPartsToString(
            symbol.getDocumentationComment(checker)
        ),
        properties: [],
        extends: [], // Initialize the extends array
    };

    const type = checker.getDeclaredTypeOfSymbol(symbol);

    // Get only direct properties (i.e., properties declared directly in the
    // interface)
    if (symbol.declarations && symbol.declarations.length > 0) {
        const declaration = symbol.declarations[0] as ts.InterfaceDeclaration;

        // Ensure the declaration has members (properties) and iterate over them
        if (declaration.members) {
            declaration.members.forEach((member) => {
                if (ts.isPropertySignature(member)) {
                    const memberSymbol = checker.getSymbolAtLocation(
                        member.name
                    );
                    if (memberSymbol) {
                        const memberType = checker.getTypeOfSymbolAtLocation(
                            memberSymbol,
                            member
                        );
                        const isOptional = !!member.questionToken;
                        details.properties?.push({
                            name: memberSymbol.getName(),
                            type: checker.typeToString(memberType),
                            optional: isOptional,
                        });
                    }
                }
            });
        }

        // Extract `extends` information from heritageClauses
        if (declaration.heritageClauses) {
            declaration.heritageClauses.forEach((clause) => {
                clause.types.forEach((typeNode) => {
                    const extendsType = checker.getTypeAtLocation(typeNode);
                    details.extends?.push(checker.typeToString(extendsType));
                });
            });
        }
    } else {
        console.warn(`No declarations found for symbol: ${symbol.getName()}`);
    }

    return details;
}
export function serializeTypeAlias(
    symbol: ts.Symbol,
    checker: ts.TypeChecker
): DocEntry {
    const details: DocEntry = {
        name: symbol.getName(),
        documentation: ts.displayPartsToString(
            symbol.getDocumentationComment(checker)
        ),
        type: checker.typeToString(checker.getDeclaredTypeOfSymbol(symbol)),
        path: symbol.declarations?.[0]?.getSourceFile().fileName,
        properties: [],
    };

    // Handle more complex types (union, intersection, array, or object types)
    if (ts.isTypeAliasDeclaration(symbol.declarations?.[0])) {
        const declaration = symbol.declarations[0] as ts.TypeAliasDeclaration;
        const type = checker.getTypeAtLocation(declaration.type);

        if (type.isUnion()) {
            // Handle union types like `TypeA | TypeB`
            details.type = type.types
                .map((t) => checker.typeToString(t))
                .join(" | ");
        } else if (type.isIntersection()) {
            // Handle intersection types like `TypeA & TypeB`
            details.type = type.types
                .map((t) => checker.typeToString(t))
                .join(" & ");
        } else if (ts.isArrayTypeNode(declaration.type)) {
            // Handle array types like `Type[]`
            const elementType = checker.getTypeAtLocation(
                declaration.type.elementType
            );
            details.type = `${checker.typeToString(elementType)}[]`;
        } else if (type.getFlags() & ts.TypeFlags.Object) {
            // Handle object types (types with properties)
            const symbolProperties = (declaration.type as ts.TypeLiteralNode)
                .members;
            if (!symbolProperties) {
                return details;
            }
            symbolProperties.forEach((member) => {
                if (ts.isPropertySignature(member)) {
                    const memberSymbol = checker.getSymbolAtLocation(
                        member.name
                    );
                    if (memberSymbol) {
                        const propertyType = checker.getTypeOfSymbolAtLocation(
                            memberSymbol,
                            member
                        );
                        const isOptional = !!member.questionToken;
                        details.properties.push({
                            name: memberSymbol.getName(),
                            type: checker.typeToString(propertyType),
                            optional: isOptional,
                        });
                    }
                }
            });
        }
    }

    return details;
}

export function serializeEnum(
    symbol: ts.Symbol,
    checker: ts.TypeChecker
): DocEntry {
    const details: DocEntry = {
        name: symbol.getName(),
        documentation: ts.displayPartsToString(
            symbol.getDocumentationComment(checker)
        ),
        properties: [],
        path: symbol.declarations?.[0]?.getSourceFile().fileName,
    };

    const type = checker.getDeclaredTypeOfSymbol(symbol);
    type.getProperties().forEach((prop) => {
        details.properties.push({
            name: prop.getName(),
            type: "enum",
        });
    });

    return details;
}
