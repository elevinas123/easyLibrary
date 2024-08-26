import React from "react";
import Tesseract from "tesseract.js";

type TextProps = {
    paragraphs: Tesseract.Paragraph[];
    fontSize: number;
};

export default function Text({ paragraphs, fontSize }: TextProps) {
    const maxCharactersPerLine = 50; // Maximum characters per line
    const lineHeight = fontSize * 1.5; // Line height based on font size

    const renderParagraphs = () => {
        return paragraphs.map((paragraph, paraIndex) => {
            const words = paragraph.lines.flatMap((line) =>
                line.text.split(" ")
            ); // Flatten all words from all lines in the paragraph
            const lines = [];
            let currentLine = "";

            words.forEach((word, index) => {
                if (
                    currentLine.length + word.length + 1 >
                    maxCharactersPerLine
                ) {
                    // Save the current line and start a new one
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    // Append word to the current line
                    if (currentLine.length > 0) {
                        currentLine += " "; // Add a space before appending the word
                    }
                    currentLine += word;
                }

                // If it's the last word and there’s content in the current line, push it
                if (index === words.length - 1 && currentLine.length > 0) {
                    lines.push(currentLine);
                }
            });

            // If there's a line with only one word and it's not the only line, merge it with the previous one
            for (let i = 1; i < lines.length; i++) {
                const previousLine = lines[i - 1];
                const currentLine = lines[i];

                if (currentLine.split(" ").length === 1) {
                    lines[i - 1] = `${previousLine} ${currentLine}`;
                    lines.splice(i, 1); // Remove the current line
                    i--; // Re-adjust index
                }
            }

            return (
                <div
                    key={paraIndex}
                    style={{
                        marginBottom: `${lineHeight}px`,
                        fontSize: `${fontSize}px`,
                        lineHeight: `${lineHeight}px`,
                    }}
                >
                    {lines.map((line, lineIndex) => (
                        <p key={lineIndex} className="truncate">
                            {line}
                        </p>
                    ))}
                </div>
            );
        });
    };

    return (
        <div style={{ minHeight: "100vh", width: "100%" }}>
            {renderParagraphs()}
        </div>
    );
}
