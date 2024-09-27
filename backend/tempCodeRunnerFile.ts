// backend/generate-endpoint-map.ts

import * as fs from 'fs';
import * as path from 'path';

// Paths to your JSON files
const endpointMapJsonPath = path.resolve(__dirname, 'endpointMap.json');
const endpointMapTsPath =
    path.resolve(__dirname, '../frontend/src/endPointTypes/endpointMap.ts');

// Read endpointMap.json
const endpointMapJson =
    JSON.parse(fs.readFileSync(endpointMapJsonPath, 'utf-8'));

// Generate TypeScript mapping
let endpointMapTsContent =
    `// This file is auto-generated from endpointMap.json. Do not modify manually.\n\n`;
endpointMapTsContent += `export const endpointMap = {\n`;

for (const [endpoint, returnType] of Object.entries(endpointMapJson)) {
  endpointMapTsContent += `  "${endpoint}": "${returnType}",\n`;
}

endpointMapTsContent += `} as const;\n\n`;

// Export Endpoint type
endpointMapTsContent += `export type Endpoint = keyof typeof endpointMap;\n\n`;

// Export ApiResponseTypes type
endpointMapTsContent += `export type ApiResponseTypes = {\n`;

for (const [endpoint, returnType] of Object.entries(endpointMapJson)) {
  // Extract the type inside Promise<>
  const promiseMatch = (returnType as string).match(/Promise<(.*)>/);
  const actualType = promiseMatch ? promiseMatch[1].trim() : returnType;
  endpointMapTsContent += `  "${endpoint}": ${actualType};\n`;
}

endpointMapTsContent += `};\n`;

// Write to endpointMap.ts
fs.writeFileSync(endpointMapTsPath, endpointMapTsContent, 'utf-8');

console.log(`Generated ${endpointMapTsPath} successfully.`);
