import { useEffect, useState } from "react";
import {
    HtmlElementObject,
    HtmlObject,
} from "../../../../../preprocess/epub/preprocessEpub";
import { VisibleArea } from "../../KonvaStage";
import HighlightLayer from "./HighlightLayer";
import TextLayer from "./TextLayer";

type MainLayerProps = {
    bookElements: (HtmlObject | null)[];
    visibleArea: VisibleArea;
    fontSize: number;
    width: number;
};
export type ProcessedElement = {
    text: string;
    lineX: number;
    lineWidth: number;
    lineY: number;
};
export default function MainLayer({
    bookElements,
    visibleArea,
    fontSize,
    width,
}: MainLayerProps) {
    const [processedElements, setProcessedElements] = useState<
        ProcessedElement[]
    >([]);
    useEffect(() => {
        let indexStart = 0;

        const elements = bookElements
            .filter((elements) => elements !== null)
            .flatMap((elements) => {
                const result = processElements(
                    elements,
                    indexStart,
                    fontSize,
                    width
                );
                indexStart += result.length;
                return result;
            })
            .filter((_, index) => index < 1000);
        setProcessedElements(elements);
    }, [bookElements]);
    const processElements = (
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
            if (
                currentLineWidth + fontSize <= width &&
                element.text[i] !== "\n"
            ) {
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

    return (
        <>
            <HighlightLayer
                processedElements={processedElements}
                visibleArea={visibleArea}
                fontSize={fontSize}
            />
            <TextLayer
                processedElements={processedElements}
                visibleArea={visibleArea}
                fontSize={fontSize}
                width={width}
            />
        </>
    );
}
