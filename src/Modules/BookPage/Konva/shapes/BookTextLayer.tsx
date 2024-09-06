import { Layer, Rect, Text } from "react-konva";
import Konva from "konva";
import {
    HtmlElementObject,
    HtmlObject,
} from "../../../../preprocess/epub/preprocessEpub";
import { useEffect, useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { v4 as uuidv4 } from "uuid";
import { useAtom } from "jotai";
import { activeToolAtom, offsetPositionAtom } from "../konvaAtoms";
import { VisibleArea } from "../KonvaStage";

type BookTextItemProps = {
    bookElements: (HtmlObject | null)[];
    visibleArea: VisibleArea;
};

const fontSize = 24;
const width = 1200;
// Function to measure the width of a given text using Konva's Text API
const measureTextWidth = (
    text: string,
    fontFamily = "Courier New",
    fontSize = 24
) => {
    const tempText = new Konva.Text({
        text: text,
        fontSize: fontSize,
        fontFamily: fontFamily,
        visible: false, // You don't need to render this
    });
    return tempText.width();
};

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

const BookTextLayer = ({ bookElements, visibleArea }: BookTextItemProps) => {
    type Highlight = {
        id: string;
        startingX: number;
        startingY: number;
        endX: number;
        endY: number;
    };
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [activeTool] = useAtom(activeToolAtom);
    const [offsetPosition] = useAtom(offsetPositionAtom);

    const [processedElements, setProcessedElemets] = useState<
        ProcessedElements[]
    >([]);
    type RenderedText = {
        x: number;
        y: number;
        height: number;
        width: number;
        text: string;
        fontSize: number;
        fill: string;
        fontFamily: string;
    };
    const [renderedTextElements, setRenderedTextElements] = useState<
        RenderedText[]
    >([]);
    useEffect(() => {
        setRenderedTextElements(renderText());
        console.log("rendering done");
    }, [processedElements]);
    type RenderedHighlights = {
        y: number;
        x: number;
        width: number;
        height: number;
        fill: string;
        opacity: number;
    };
    const [renderedhighlightElements, setRenderedhighlightElements] = useState<
        RenderedHighlights[]
    >([]);
    const [virtualizedText, setVirtualizedText] = useState<JSX.Element[]>([]);
    const [virtualizedHighlights, setVirtualizedHighlights] = useState<JSX.Element[]>([]);
    useEffect(() => {
        setVirtualizedHighlights(
            renderedhighlightElements
                .filter(
                    (element) =>
                        element.x + element.width > visibleArea.x &&
                        element.x < visibleArea.x + visibleArea.width &&
                        element.y + element.height > visibleArea.y &&
                        element.y < visibleArea.y + visibleArea.height
                )
                .map((element) => (
                    <Rect
                        x={element.x}
                        y={element.y}
                        width={element.width}
                        height={element.height}
                        fill={element.fill}
                        opacity={element.opacity}
                    />
                ))
        );
    }, [visibleArea, renderedhighlightElements]);
    useEffect(() => {
        setVirtualizedText(
            renderedTextElements
                .filter(
                    (element) =>
                        element.x + element.width > visibleArea.x &&
                        element.x < visibleArea.x + visibleArea.width &&
                        element.y + element.height > visibleArea.y &&
                        element.y < visibleArea.y + visibleArea.height
                )
                .map((element) => (
                    <Text
                        x={element.x}
                        y={element.y}
                        width={element.width}
                        height={element.height}
                        fill={element.fill}
                        text={element.text}
                        fontSize={element.fontSize}
                        fontFamily={element.fontFamily}
                    />
                ))
        );
    }, [visibleArea, renderedTextElements]);
    useEffect(() => {
        setRenderedhighlightElements(renderHighlights());
        console.log("this done");
    }, [processedElements, highlights]);
    const [currentHighlightId, setCurrentHighlightId] = useState<string | null>(
        null
    );
    useEffect(() => {
        console.log("virtualizedHighlights", virtualizedHighlights)
    }, [virtualizedHighlights])

    type ProcessedElements = {
        text: string;
        lineX: number;
        lineWidth: number;
        lineY: number;
    };
    useEffect(() => {
        let indexStart = 0;

        const elements = bookElements
            .filter((elements) => elements !== null)
            .flatMap((elements) => {
                const result = processElements(elements, indexStart);
                indexStart += result.length;
                return result;
            })
            .filter((_, index) => index < 1000);
        setProcessedElemets(elements);
    }, [bookElements]);
    const calculateXPositionInText = (
        text: string,
        textStartingX: number,
        mouseStartingX: number
    ) => {
        const textWidth = measureTextWidth(text) / text.length;
        const posInText = Math.floor(
            (mouseStartingX - textStartingX) / textWidth
        );
        return posInText;
    };
    useEffect(() => {
        console.log("higlhihts", highlights);
    }, [highlights]);
    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (activeTool === "Pan") return;
        const currentId = uuidv4();
        setCurrentHighlightId(currentId);
        setHighlights((oldHighlights) => [
            ...oldHighlights,
            {
                id: currentId,
                startingX: calculateXPositionInText(
                    e.target.attrs.text,
                    e.target.attrs.x + offsetPosition.x,
                    e.evt.x
                ),
                startingY: Math.floor((e.target.attrs.y - 200) / fontSize),
                endX: calculateXPositionInText(
                    e.target.attrs.text,
                    e.target.attrs.x + offsetPosition.x,
                    e.evt.x
                ),
                endY: Math.floor((e.target.attrs.y - 200) / fontSize),
            },
        ]);
        console.log("evt", e);
        console.log(
            "x",
            calculateXPositionInText(
                e.target.attrs.text,
                e.target.attrs.x,
                e.evt.x
            )
        );
        console.log("y", (e.target.attrs.y - 296) / fontSize);
    };
    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        if (!currentHighlightId) {
            return;
        }

        setHighlights((highlights) => {
            const newHighlights = [...highlights];
            const highlight = newHighlights.find(
                (highlight) => currentHighlightId === highlight.id
            );

            if (!highlight) return highlights;

            const xPos = calculateXPositionInText(
                e.target.attrs.text,
                e.target.attrs.x + offsetPosition.x,
                e.evt.x
            );
            const yPos = Math.floor((e.target.attrs.y - 200) / fontSize);

            // Check if the position has actually changed
            if (highlight.endX === xPos && highlight.endY === yPos) {
                return highlights; // No change, return the current state
            }

            // Update only if the positions are different
            highlight.endX = xPos;
            highlight.endY = yPos;

            return newHighlights;
        });
    };

    const handleMouseUp = () => {
        setCurrentHighlightId(null);
    };

    const renderText = () => {
        // Process the text elements from the book

        // Render the text elements with highlights
        return processedElements.map((textElement) => {
            // Check if this textElement falls within any highlight region

            return {
                x: textElement.lineX + 600,
                y: textElement.lineY * fontSize + 200,
                width: textElement.lineWidth,
                height: fontSize,
                text: textElement.text,
                fontSize: fontSize,
                fill: "white",
                fontFamily: "Courier New",
            };
        });
    };

    const renderHighlights = () => {
        return highlights.flatMap((highlight) => {
            const range = highlight.endY - highlight.startingY;
            if (range === 0) {
                const letterWidth =
                    measureTextWidth(
                        processedElements[highlight.startingY].text
                    ) / processedElements[highlight.startingY].text.length;
                let currentX = highlight.startingX * letterWidth;
                let lineWidth =
                    (highlight.endX - highlight.startingX) * letterWidth +
                    letterWidth;
                return {
                    y: highlight.startingY * fontSize + 200,
                    x: currentX + 600,
                    width: lineWidth,
                    height: fontSize,
                    fill: "yellow",
                    opacity: 0.5,
                };
            }
            const rects = [];

            for (let i = 0; i <= range; i++) {
                const letterWidth =
                    measureTextWidth(
                        processedElements[highlight.startingY].text
                    ) / processedElements[highlight.startingY].text.length;
                let currentX = 0;
                if (i === 0) {
                    currentX = highlight.startingX * letterWidth;
                }
                let lineWidth =
                    processedElements[highlight.startingY + i].text.length *
                    letterWidth;
                if (i === 0) {
                    lineWidth -= currentX;
                }
                if (i === range) {
                    lineWidth = highlight.endX * letterWidth + letterWidth;
                }

                rects.push({
                    y: (highlight.startingY + i) * fontSize + 200,
                    x: currentX + 600,
                    width: lineWidth,
                    height: fontSize,
                    fill: "yellow",
                    opacity: 0.5,
                });
            }
            return rects;
        });
    };

    return (
        <Layer
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {virtualizedHighlights}
            {virtualizedText}
        </Layer>
    );
};

export default BookTextLayer;
