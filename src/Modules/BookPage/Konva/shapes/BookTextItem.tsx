import { Layer, Text, Rect } from "react-konva";
import {
    HtmlElementObject,
    HtmlObject,
} from "../../../../preprocess/epub/preprocessEpub";
import { useEffect, useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { v4 as uuidv4 } from "uuid";

type BookTextItemProps = {
    bookElements: (HtmlObject | null)[];
};

const fontSize = 24;
const width = 1200;
// Function to measure the width of a given text using Konva's Text API
const measureTextWidth = (
    text: string,
    fontFamily = "Courier New",
    fontSize = 24
) => {
    const tempText = new window.Konva.Text({
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

const BookTextItems = ({ bookElements }: BookTextItemProps) => {
    type MousePosition = {
        baseX: number;
        baseY: number;
        textX: number;
        textY: number;
    };
    type Highlight = {
        id: string;
        startingX: number;
        startingY: number;
        endX: number;
        endY: number;
    };
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [basePosition, setMousePosition] = useState<MousePosition | null>(
        null
    );
    const [processedElements, setProcessedElemets] = useState<
        ProcessedElements[]
    >([]);
    const [currentHighlightId, setCurrentHighlightId] = useState<string | null>(
        null
    );
    const [renderedText, setRenderedText] = useState<JSX.Element[]>([]);
    useEffect(() => {
        setRenderedText(renderText());
    }, [processedElements]);
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
        console.log(textWidth);
        const posInText = Math.floor(
            (mouseStartingX - textStartingX) / textWidth
        );
        return posInText;
    };
    useEffect(() => {
        console.log("higlhihts", highlights);
    }, [highlights]);
    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        const currentId = uuidv4();
        setCurrentHighlightId(currentId);
        setHighlights((oldHighlights) => [
            ...oldHighlights,
            {
                id: currentId,
                startingX: calculateXPositionInText(
                    e.target.attrs.text,
                    e.target.attrs.x,
                    e.evt.x
                ),
                startingY: Math.floor((e.target.attrs.y - 200) / fontSize),
                endX: calculateXPositionInText(
                    e.target.attrs.text,
                    e.target.attrs.x,
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
            console.log("e", e);
            const newHighLights = [...highlights];
            const highlight = newHighLights.filter(
                (highlight) => currentHighlightId === highlight.id
            )[0];
            console.log("higlight", highlight);
            const xPos = calculateXPositionInText(
                e.target.attrs.text,
                e.target.attrs.x,
                e.evt.x
            );
            const yPos = Math.floor((e.target.attrs.y - 200) / fontSize);
            highlight.endX = xPos;
            highlight.endY = yPos;
            console.log("higlight", highlight);

            return newHighLights;
        });
    };
    const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
        setCurrentHighlightId(null);
    };
    const renderText = () => {
        console.log("newBoook", bookElements);
        console.log("highlights", highlights);

        // Process the text elements from the book

        // Render the text elements with highlights
        return processedElements.map((textElement) => {
            // Check if this textElement falls within any highlight region
            console.log("textElement", textElement);

            return (
                <Text
                    x={textElement.lineX + 600}
                    y={textElement.lineY * fontSize + 200}
                    width={textElement.lineWidth}
                    height={fontSize}
                    text={textElement.text}
                    fontSize={fontSize}
                    fill={"white"}
                    fontFamily="Courier New"
                />
            );
        });
    };
    const renderHighlights = () => {
        return highlights.flatMap((highlight, index) => {
            const range = highlight.endY - highlight.startingY;
            console.log("rects", range)
            if (range === 0) {
                const letterWidth =
                    measureTextWidth(
                        processedElements[highlight.startingY].text
                    ) / processedElements[highlight.startingY].text.length;
                let currentX = highlight.startingX * letterWidth;
                let lineWidth =
                    (highlight.endX - highlight.startingX) * letterWidth +
                    letterWidth;
                return (
                    <Rect
                        y={highlight.startingY * fontSize + 200}
                        x={currentX + 600}
                        width={lineWidth}
                        height={fontSize}
                        fill={"yellow"}
                        opacity={0.5}
                    />
                );
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
                    lineWidth = highlight.endX * letterWidth;
                }

                console.log("currentX", currentX);
                console.log("currentXWidth", lineWidth);
                console.log(
                    "processedElements",
                    processedElements[highlight.startingY + i]
                );
                console.log(
                    "processedElementstext",
                    processedElements[highlight.startingY + i].text
                );
                rects.push(
                    <Rect
                        y={(highlight.startingY + i) * fontSize + 200}
                        x={currentX + 600}
                        width={lineWidth}
                        height={fontSize}
                        fill={"yellow"}
                    />
                );
                console.log("rects", rects);
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
            {renderHighlights()}
            {renderedText}
        </Layer>
    );
};

export default BookTextItems;
