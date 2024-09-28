// backend/generate-types.ts

import * as fs from 'fs';
import * as path from 'path';

import {TypeDict} from './analyzer';
import {findDirectoryUpwards} from './findDirectory';

export const generateTypes = (typesDict: TypeDict) => {
  // Step 1: Retrieve the frontend directory name from the environment
  const frontendDirPath = findDirectoryUpwards();
  const endPointTypesDir = path.join(frontendDirPath, 'src', 'endPointTypes');

  // Ensure that the endPointTypes directory exists; create it if it doesn't
  if (!fs.existsSync(endPointTypesDir)) {
    try {
      fs.mkdirSync(endPointTypesDir, {recursive: true});
      console.log(`Created directory: "${endPointTypesDir}"`);
    } catch (err) {
      console.error(`Error creating directory "${endPointTypesDir}":`, err);
      process.exit(1);  // Exit the script with an error code
    }
  }

  const typesTsPath = path.join(endPointTypesDir, 'types.ts');

  // Step 6: Read and parse types.json
  let typesJson = typesDict;

  // Step 7: Function to convert a single type entry to TypeScript
  const convertEntryToTypeScript = (typeName: string, entry: any) => {
    if (entry.isType) {
      // If the entry is marked as a type, generate a type alias
      return `export type ${typeName} = ${entry.type};\n\n`;
    } else {
      // Otherwise, generate an interface
      let interfaceStr = `export interface ${typeName}`;

      // Check if there are extended interfaces
      if (entry.extends && entry.extends.length > 0) {
        interfaceStr += ` extends ${entry.extends.join(', ')}`;
      }

      interfaceStr += ` {\n`;

      entry.properties.forEach((prop: any) => {
          // Handle optional properties
          console.log("props", prop)
        const optionalFlag = prop.optional ? '?' : '';
        interfaceStr += `  ${prop.name}${optionalFlag}: ${prop.type};\n`;
      });

      interfaceStr += `}\n\n`;
      return interfaceStr;
    }
  };

  // Step 8: Generate TypeScript content
  let typesTsContent =
      `// This file is auto-generated from types.json. Do not modify manually.\n\n`;

  for (const [typeName, entry] of Object.entries(typesJson)) {
    // Validate if it's an object
    if (typeof entry !== 'object') {
      console.warn(`Warning: Entry for type "${
          typeName}" should be an object. Skipping this type.`);
      continue;
    }

    // Add the appropriate TypeScript (either type or interface)
    typesTsContent += convertEntryToTypeScript(typeName, entry);
  }

  // Step 9: Handle custom types if necessary (e.g., ObjectId)
  typesTsContent += `export type ObjectId = string;\n`;

  // Step 10: Write the generated content to types.ts
  try {
    fs.writeFileSync(typesTsPath, typesTsContent, 'utf-8');
    console.log(`Successfully generated "${typesTsPath}"`);
  } catch (err) {
    console.error(`Error writing to "${typesTsPath}":`, err);
    process.exit(1);  // Exit the script with an error code
  }
};
