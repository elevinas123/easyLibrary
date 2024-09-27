// backend/generate-types.ts

import * as fs from 'fs';
import * as path from 'path';

// Path to your types.json
const typesJsonPath = path.resolve(__dirname, 'types.json');
// Path to the output TypeScript file in frontend's endPointTypes directory
const typesTsPath =
    path.resolve(__dirname, '../frontend/src/endPointTypes/types.ts');

// Read types.json
const typesJson = JSON.parse(fs.readFileSync(typesJsonPath, 'utf-8'));

// Function to convert a single type entry to a TypeScript interface
const convertTypeToInterface = (typeName: string, properties: any[]) => {
  let interfaceStr = `export interface ${typeName} {\n`;
  properties.forEach((prop: any) => {
    interfaceStr += `  ${prop.name}: ${prop.type};\n`;
  });
  interfaceStr += `}\n\n`;
  return interfaceStr;
};

// Generate TypeScript interfaces
let typesTsContent =
    `// This file is auto-generated from types.json. Do not modify manually.\n\n`;
for (const [typeName, properties] of Object.entries(typesJson)) {
  const prop = properties as any[];
  typesTsContent += convertTypeToInterface(typeName, prop);
}

// Handle custom types if necessary, e.g., StartType, ObjectId
typesTsContent += `export type ObjectId = string;\n`;

// Write to types.ts
fs.writeFileSync(typesTsPath, typesTsContent, 'utf-8');

console.log(`Generated ${typesTsPath} successfully.`);
