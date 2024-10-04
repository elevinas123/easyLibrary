import * as ts from "typescript";

// Get the HTTP method type from decorators
export function getHttpMethod(node: ts.MethodDeclaration): string | undefined {
    const decorators = ts.getDecorators(node);
    if (decorators) {
        for (const decorator of decorators) {
            const callExpression = decorator.expression as ts.CallExpression;
            const decoratorName = (callExpression.expression as ts.Identifier)
                .text;
            if (
                ["Get", "Post", "Put", "Delete", "Patch"].includes(
                    decoratorName
                )
            ) {
                return decoratorName.toUpperCase();
            }
        }
    }
    return undefined;
}

// Extract parameter decorator type (e.g., `@Query`, `@Param`, `@Body`)
export function getParameterDecorator(
    _: ts.MethodDeclaration,
    paramSymbol: ts.Symbol
): string | undefined {
    const paramDeclaration =
        paramSymbol.valueDeclaration as ts.ParameterDeclaration;
    const decorators = ts.getDecorators(paramDeclaration);
    if (decorators) {
        for (const decorator of decorators) {
            const callExpression = decorator.expression as ts.CallExpression;
            const decoratorName = (callExpression.expression as ts.Identifier)
                .text;
            if (["Query", "Param", "Body", "Headers"].includes(decoratorName)) {
                return decoratorName;
            }
        }
    }
    return undefined;
}

export function getMethodPath(node: ts.MethodDeclaration): string | undefined {
    const decorators = ts.getDecorators(node);
    if (decorators) {
        for (const decorator of decorators) {
            const callExpression = decorator.expression as ts.CallExpression;
            const decoratorName = (callExpression.expression as ts.Identifier)
                .text;

            if (
                ["Get", "Post", "Put", "Delete", "Patch"].includes(
                    decoratorName
                )
            ) {
                const pathArgument = callExpression.arguments[0];
                if (pathArgument && ts.isStringLiteral(pathArgument)) {
                    return pathArgument.text;
                }
            }
        }
    }
    return undefined;
}

// Extract the controller path from the `@Controller` decorator
export function getControllerPath(
    node: ts.ClassDeclaration
): string | undefined {
    const decorators = ts.getDecorators(node);
    if (decorators) {
        for (const decorator of decorators) {
            const callExpression = decorator.expression as ts.CallExpression;
            if (
                ts.isIdentifier(callExpression.expression) &&
                callExpression.expression.text === "Controller"
            ) {
                const pathArgument = callExpression.arguments[0];
                if (pathArgument && ts.isStringLiteral(pathArgument)) {
                    return pathArgument.text;
                }
            }
        }
    }
    return undefined;
}
