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
    };

    const classType = checker.getDeclaredTypeOfSymbol(symbol);

    details.constructors = classType
        .getConstructSignatures()
        .map(serializeSignature(checker));
    details.path = controllerPath || ""; // Add controller path

    details.methods = classType
        .getProperties()
        .filter((prop) => prop.declarations?.some(ts.isMethodDeclaration))
        .map((method) => serializeMethod(method, checker, classType));

    details.properties = classType
        .getProperties()
        .filter((prop) => prop.declarations?.some(ts.isPropertyDeclaration))
        .map((prop) => serializeSymbol(prop, checker));

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
        path: symbol.declarations?.[0]?.getSourceFile().fileName,
    };

    const type = checker.getDeclaredTypeOfSymbol(symbol);
    type.getProperties().forEach((prop) => {
        const propType = checker.getTypeOfSymbolAtLocation(
            prop,
            prop.valueDeclaration!
        );
        details.properties.push({
            name: prop.getName(),
            type: checker.typeToString(propType),
        });
    });

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
    };

    

    // Handle union types or complex types
    if (ts.isTypeAliasDeclaration(symbol.declarations?.[0])) {
        const declaration = symbol.declarations[0] as ts.TypeAliasDeclaration;
        const type = checker.getTypeAtLocation(declaration.type);

        // Check if the type is a union (e.g., `TypeA | TypeB`)
        if (type.isUnion()) {
            details.type = type.types
                .map((t) => checker.typeToString(t))
                .join(" | ");
        } else if (type.isIntersection()) {
            details.type = type.types
                .map((t) => checker.typeToString(t))
                .join(" & ");
        } else if (ts.isArrayTypeNode(declaration.type)) {
            // Handle array types
            const elementType = checker.getTypeAtLocation(
                declaration.type.elementType
            );
            details.type = `${checker.typeToString(elementType)}[]`;
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
