// scripts/generateInputMap.ts
import * as fs from "fs";
import * as path from "path";

// Paths to the JSON files
const inputMapPath = path.resolve(__dirname, "inputMap.json");
const endpointMapPath = path.resolve(__dirname, "endpointMap.json");

// Output path for the generated TypeScript file
const outputPath = path.resolve(
    __dirname,
    "../frontend/src/endPointTypes/inputMap.ts"
);


// Read and parse JSON files
const inputMapJson = fs.readFileSync(inputMapPath, "utf-8");
const inputMapData = JSON.parse(inputMapJson);

const endpointMapJson = fs.readFileSync(endpointMapPath, "utf-8");
const endpointMapData: Record<string, string> = JSON.parse(endpointMapJson);

// Start building the TypeScript content
let tsContent = `// This file is auto-generated from inputMap.json and endpointMap.json. Do not modify manually.

export type InputMap = {
`;

// Iterate over each endpoint in endpointMap
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
fs.writeFileSync(outputPath, tsContent, "utf-8");

console.log("inputMap.ts has been generated successfully.");
