import Tesseract from "tesseract.js";

// Function to preprocess text by lines across multiple pages
export const preprocessText = (
    pages: Tesseract.Page[],
) => {

    // Iterate over each page
    let allParagpraphs: Tesseract.Paragraph[] = [];
    pages.forEach((page) => {
        // Extract and filter lines from the page
        const paragraphs = page.paragraphs;
        paragraphs.forEach((paragraph) => {
            paragraph.lines =  removeLowConfidence(paragraph.lines)
            allParagpraphs.push(paragraph);
            
        });
    });

    console.log("allParagpraphs", allParagpraphs);
    return allParagpraphs;
};

// Function to filter out lines with low confidence
const removeLowConfidence = (lines: Tesseract.Line[]) => {
    return lines.filter((line) => line.confidence > 60);
};

// Function to remove extra whitespace from the text
export const removeExtraWhitespace = (text: string) => {
    // Replace multiple spaces, tabs, and newlines with a single space
    return text
        .replace(/[\s\n]+/g, " ") // Replace all whitespace including newlines with a single space
        .replace(/\s([?.!,;:])/g, "$1") // Remove space before punctuation
        .replace(/([?.!,;:])\s(?=[?.!,;:])/g, "$1") // Remove space between consecutive punctuation marks
        .trim();
};
