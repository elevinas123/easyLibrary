import fs from "fs";
import path from "path";

const OUTPUT_FILE = "all-code.txt";
const ROOT_DIR = path.join(process.cwd(), "src"); // Change if your src path is different

let allFiles = []; // Array to store file information
let fileContents = {}; // Object to store file contents

// First pass: collect all file paths and content
function collectTSFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      collectTSFiles(fullPath); // Recursively check subfolders
    } else if (
      entry.isFile() &&
      (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx"))
    ) {
      const relativePath = path.relative(ROOT_DIR, fullPath);
      const code = fs.readFileSync(fullPath, "utf-8");
      
      allFiles.push(relativePath);
      fileContents[relativePath] = code;
    }
  }
}

// Generate a table of contents with links
function generateTOC() {
  let toc = "# Table of Contents\n\n";
  
  allFiles.forEach((file, index) => {
    // Create a link using markdown-compatible anchor format
    // Convert file path to a safe anchor ID
    const safeId = `file-${index + 1}-${file.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`;
    toc += `${index + 1}. [${file}](#${safeId})\n`;
  });
  
  toc += "\n\n---\n\n";
  return toc;
}

// Generate the full document with TOC and page breaks
function generateDocument() {
  let document = generateTOC();
  
  allFiles.forEach((file, index) => {
    // Create a heading with an ID that matches the TOC link
    const safeId = `file-${index + 1}-${file.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`;
    document += `<h2 id="${safeId}">File ${index + 1}: ${file}</h2>\n\n`;
    document += "```typescript\n";
    document += fileContents[file];
    document += "\n```\n\n";
    
    // Add a page break after each file (except the last one)
    if (index < allFiles.length - 1) {
      document += "<div style='page-break-after: always;'></div>\n\n";
    }
  });
  
  return document;
}

// Main execution
collectTSFiles(ROOT_DIR);
const document = generateDocument();

// Write everything to the output file
fs.writeFileSync(OUTPUT_FILE, document, "utf-8");
console.log(`✅ Combined .ts/.tsx files with TOC written to ${OUTPUT_FILE}`);
