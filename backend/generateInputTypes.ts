// scripts/generateInputMap.ts

import * as fs from 'fs';
import * as path from 'path';

// Paths to the JSON files
const inputMapPath = path.resolve(__dirname, 'inputMap.json');
const endpointMapPath = path.resolve(__dirname, 'endpointMap.json');

// Output path for the generated TypeScript file
const outputPath =
    path.resolve(__dirname, '../frontend/src/endPointTypes/inputMap.ts');

// Read and parse JSON files
const inputMapJson = fs.readFileSync(inputMapPath, 'utf-8');
const inputMapData = JSON.parse(inputMapJson);

const endpointMapJson = fs.readFileSync(endpointMapPath, 'utf-8');
const endpointMapData: Record<string, string> = JSON.parse(endpointMapJson);

// Define basic primitive types to exclude from imports
const basicTypes = ['string', 'number', 'boolean'];

// Set to collect unique non-primitive type names
const imports = new Set<string>();

/**
 * Extracts type names from a given type string.
 * This function handles basic types, arrays, unions, intersections, and
 * generics. It assumes that non-primitive types are single words (e.g.,
 * CreateBookDto).
 *
 * @param typeStr The type string to extract from (e.g., "CreateBookDto |
 *     UpdateBookDto[]")
 * @returns An array of extracted type names
 */
function extractTypeNames(typeStr: string): string[] {
  const typeNames: string[] = [];

  // Remove array brackets
  const cleanedTypeStr = typeStr.replace(/\[\]/g, '');

  // Split by union and intersection operators
  const splitTypes = cleanedTypeStr.split(/[\|\&]/).map(type => type.trim());

  splitTypes.forEach(type => {
    // Remove generic wrappers (e.g., Partial<CreateBookDto> => CreateBookDto)
    const genericMatch = type.match(/^(\w+)<(.+)>$/);
    if (genericMatch) {
      const innerType = genericMatch[2];
      typeNames.push(...extractTypeNames(innerType));
    } else {
      // Exclude basic types and inline object types
      if (!basicTypes.includes(type.toLowerCase()) && !type.startsWith('{') &&
          /^[A-Za-z_][A-Za-z0-9_]*$/.test(type)) {
        typeNames.push(type);
      }
    }
  });

  return typeNames;
}

// Iterate over each endpoint in endpointMapData
for (const endpoint of Object.keys(endpointMapData)) {
  if (inputMapData.hasOwnProperty(endpoint)) {
    const inputs = inputMapData[endpoint];

    // Check and collect types from query
    if (inputs.query) {
      const queryTypes = extractTypeNames(inputs.query);
      queryTypes.forEach(type => imports.add(type));
    }

    // Check and collect types from params
    if (inputs.params) {
      const paramsTypes = extractTypeNames(inputs.params);
      paramsTypes.forEach(type => imports.add(type));
    }

    // Check and collect types from body
    if (inputs.body) {
      const bodyTypes = extractTypeNames(inputs.body);
      bodyTypes.forEach(type => imports.add(type));
    }
  }
}

// Define the module path where all non-primitive types are exported from
// Adjust this path based on your project structure
const typesModulePath = './types';

// Generate import statements
let importStatements = '';
if (imports.size > 0) {
  importStatements = `import { ${Array.from(imports).join(', ')} } from '${
      typesModulePath}';\n\n`;
}

// Start building the TypeScript content
let tsContent =
    `// This file is auto-generated from inputMap.json and endpointMap.json. Do not modify manually.

${importStatements}export type InputMap = {
`;

// Iterate over each endpoint in endpointMapData to build the InputMap type
for (const endpoint of Object.keys(endpointMapData)) {
  if (inputMapData.hasOwnProperty(endpoint)) {
    const inputs = inputMapData[endpoint];
    tsContent += `  "${endpoint}": {\n`;

    if (inputs.query) {
      tsContent += `    query: ${inputs.query};\n`;
    }

    if (inputs.params) {
      tsContent += `    params: ${inputs.params};\n`;
    }

    if (inputs.body) {
      tsContent += `    body: ${inputs.body};\n`;
    }

    tsContent += `  };\n`;
  } else {
    // No inputs for this endpoint
    tsContent += `  "${endpoint}": {};\n`;
  }
}

tsContent += `};

export default InputMap;
`;

// Write to inputMap.ts
fs.writeFileSync(outputPath, tsContent, 'utf-8');

console.log('inputMap.ts has been generated successfully.');
