import { Layer, Text, Rect } from "react-konva";
import {
    HtmlElementObject,
    HtmlObject,
} from "../../../../preprocess/epub/preprocessEpub";
import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";

type BookTextItemProps = {
    bookElements: (HtmlObject | null)[];
    highlightedIndices: number[]; // Indices of highlighted characters
};

const fontSize = 24;
const width = 1200;

const processTextIntoLines = (
    element: HtmlElementObject,
    indexStart: number
) => {
    let textLines: string[][] = [[]];
    let currentLineWidth = 0;
    for (let i = 0, j = 0; i < element.text.length; i++) {
        if (currentLineWidth + fontSize <= width && element.text[i] !== "\n") {
            textLines[j].push(element.text[i]);
            currentLineWidth += fontSize;
        } else {
            j++;
            textLines.push([]);
            if (element.text[i] === "\n") {
                currentLineWidth = 0;
            } else {
                currentLineWidth = fontSize;
                textLines[j].push(element.text[i]);
            }
        }
    }
    return textLines
        .filter((line) => line.length > 0)
        .map((line, lineIndex) => ({
            text: line.join(""),
            lineX: 0,
            lineWidth: line.length * fontSize,
            lineY: lineIndex + indexStart,
        }));
};

const processElements = (elements: HtmlObject, indexStart: number) => {
    let currentIndex = indexStart;

    const processedLines = elements.elements.flatMap((element) => {
        const lines = processTextIntoLines(element, currentIndex);
        currentIndex += lines.length;
        return lines;
    });

    return processedLines;
};

const BookTextItems = ({
    bookElements,
    highlightedIndices,
}: BookTextItemProps) => {
    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        console.log("handleMouseDown", e);
    };
    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {};
    const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {};
    const renderText = (bookElements: (HtmlObject | null)[]) => {
        let indexStart = 0;
        const processedElements = bookElements
            .filter((elements) => elements !== null)
            .flatMap((elements) => {
                const result = processElements(elements, indexStart);
                indexStart += result.length;
                return result;
            })
            .filter((_, index) => index < 1000);

        return processedElements.map((textElement, textIndex) => {
            const isHighlighted = highlightedIndices.includes(textIndex); // Check if the current element is highlighted

            return (
                <>
                    {isHighlighted && (
                        <Rect
                            x={textElement.lineX + 600} // Match the position of the text
                            y={textElement.lineY * fontSize + 200}
                            width={textElement.lineWidth}
                            height={fontSize}
                            fill="yellow" // Highlight color
                            opacity={0.5} // Optional: Adjust opacity for a better visual effect
                        />
                    )}
                    <Text
                        x={textElement.lineX + 600}
                        y={textElement.lineY * fontSize + 200}
                        width={textElement.lineWidth}
                        height={fontSize}
                        text={textElement.text}
                        fontSize={fontSize}
                        fill={"white"}
                    />
                </>
            );
        });
    };

    return (
        <Layer
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {renderText(bookElements)}
        </Layer>
    );
};

export default BookTextItems;
