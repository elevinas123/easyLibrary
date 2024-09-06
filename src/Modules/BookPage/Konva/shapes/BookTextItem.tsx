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
        setCurrentHighlightId(uuidv4());
        setHighlights((oldHighlights) => [
            ...oldHighlights,
            {
                id: uuidv4(),
                startingX: calculateXPositionInText(
                    e.target.attrs.text,
                    e.target.attrs.x,
                    e.evt.x
                ),
                startingY: Math.floor(
                    (e.evt.screenY - e.target.attrs.y) / fontSize
                ),
                endX:
                    calculateXPositionInText(
                        e.target.attrs.text,
                        e.target.attrs.x,
                        e.evt.x
                    ) + 3,
                endY: Math.floor((e.evt.screenY - e.target.attrs.y) / fontSize),
            },
        ]);
        console.log("evt", e);
        console.log(
            "handleMouseDown",
            calculateXPositionInText(
                e.target.attrs.text,
                e.target.attrs.x,
                e.evt.x
            )
        );
    };
    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {};
    const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {};
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
        return highlights.map((highlight) => {
            const range = highlight.startingY - highlight.endY;
            const rects = [];

            for (let i = 0; i <= range; i++) {
                let currentX = 0;
                if (i === 0) {
                    currentX = highlight.startingX;
                }
                const lineWidth =
                    processedElements[highlight.startingY + i].text.length *
                    measureTextWidth(
                        processedElements[highlight.startingY + i].text
                    );
                console.log("width", lineWidth);
                console.log("width", processedElements[highlight.startingY + i].text);
                rects.push(
                    <Rect
                        y={(highlight.startingY + i) * fontSize + 200}
                        x={currentX + 600}
                        width={10}
                        height={fontSize}
                    />
                );
            }
        });
    };
    return (
        <Layer
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {renderedText}
            {renderHighlights()}
        </Layer>
    );
};

export default BookTextItems;
