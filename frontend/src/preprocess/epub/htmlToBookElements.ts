import { HtmlElementObject, HtmlObject } from "./preprocessEpub";

export const processElements = (
    bookElements: (HtmlObject | null)[],
    fontSize: number,
    width: number
) => {
    let indexStart = 0;

    return bookElements
        .filter((elements) => elements !== null)
        .flatMap((elements) => {
            const result = processBookElement(
                elements,
                indexStart,
                fontSize,
                width
            );
            indexStart += result.length;
            return result;
        });
};

const processBookElement = (
    elements: HtmlObject,
    indexStart: number,
    fontSize: number,
    width: number
) => {
    let currentIndex = indexStart;

    const processedLines = elements.elements.flatMap((element) => {
        const lines = processTextIntoLines(
            element,
            currentIndex,
            fontSize,
            width
        );
        currentIndex += lines.length;
        return lines;
    });

    return processedLines;
};

const processTextIntoLines = (
    element: HtmlElementObject,
    indexStart: number,
    fontSize: number,
    width: number
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
