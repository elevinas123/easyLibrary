import {
    ForwardedRef,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import { Text } from "react-konva";
import { v4 as uuidv4 } from "uuid";

import { useAtom } from "jotai";
import { KonvaEventObject } from "konva/lib/Node";
import { ProcessedElement } from "../../../../../preprocess/epub/htmlToBookElements";
import { VisibleArea } from "../../KonvaStage";
import { getPos } from "../../functions/getPos";
import {
    measureCharacterWidths,
    measureTextWidth,
} from "../../functions/measureTextWidth";
import {
    activeToolAtom,
    bookIdAtom,
    currentHighlightAtom,
    highlightsAtom,
    offsetPositionAtom,
    scaleAtom,
} from "../../konvaAtoms";
import { useSettings } from "../../../../../hooks/useSettings";

type TextLayerProps = {
    visibleArea: VisibleArea;
    fontSize: number;
    width: number;
    processedElements: ProcessedElement[];
};
// Specific element types

export type TextLayerRef = {
    handleMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseUp: () => void;
};

type BookTextElement = {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    fontSize: number;
    fill: string;
    fontFamily: string;
    strokeColor: string;
    strokeWidth: number;
    opacity: number;
};

function TextLayer(
    { visibleArea, processedElements }: TextLayerProps,
    ref: ForwardedRef<TextLayerRef>
) {
    const [textElements, setTextElements] = useState<BookTextElement[]>([]);
    const [virtualizedText, setVirtualizedText] = useState<JSX.Element[]>([]);
    const [offsetPosition] = useAtom(offsetPositionAtom);
    const [_, setHighlights] = useAtom(highlightsAtom);
    const [currentHighlight, setCurrentHighlight] =
        useAtom(currentHighlightAtom);
    const [activeTool] = useAtom(activeToolAtom);
    const [scale] = useAtom(scaleAtom);
    const [initialOffset] = useState({ x: 600, y: 200 });
    const { settings } = useSettings();
    const [bookId] = useAtom(bookIdAtom);
    const fontSize = settings?.fontSize;
    const fontFamily = settings?.fontFamily;
    useImperativeHandle(
        ref,
        () => ({
            handleMouseDown(e: KonvaEventObject<MouseEvent>) {
                if (!bookId) return;
                if (!fontSize) return;
                const pos = getPos(offsetPosition, scale, e);
                if (!pos) return;
                if (activeTool !== "Select") return;
                if (!e.target.attrs.text) return;
                const currentId = uuidv4() as string;
                const element = Math.floor(
                    (pos.y - initialOffset.y) / fontSize
                );
                const textElement = textElements[element];
                const textElementCords = [
                    textElement.x,
                    textElement.x +
                        measureTextWidth(textElement.text, fontSize, fontFamily),
                ];
                if (pos.x < textElementCords[0] || pos.x > textElementCords[1])
                    return;
                setCurrentHighlight({
                    id: currentId,
                    editing: false,
                    creating: true,
                    mousePosition: { x: pos.x, y: pos.y },
                    offsetPosition: { x: e.evt.offsetX, y: e.evt.offsetY },
                });
                
                // Calculate the starting positions
                const startingX = calculateXPositionInText(
                    e.target.attrs.text,
                    e.target.attrs.x,
                    pos.x,
                    scale
                );
                const startingY = Math.floor(
                    (e.target.attrs.y - initialOffset.y) / fontSize
                );
                
                setHighlights((oldHighlights) => [
                    ...oldHighlights,
                    {
                        bookId: bookId,
                        id: currentId,
                        startingX: startingX,
                        startingY: startingY,
                        endX: startingX,
                        endY: startingY,
                        // Initialize with the character at the starting position
                        highlightedText: e.target.attrs.text.charAt(startingX) || ''
                    },
                ]);
            },
            handleMouseMove(e: KonvaEventObject<MouseEvent>) {
                if (!fontSize) return;

                if (!currentHighlight.creating) return;
                const currentHighlightId = currentHighlight.id;
                if (!e.target.attrs.text) return;
                const pos = getPos(offsetPosition, scale, e);
                if (!pos) return;
                const element = Math.floor(
                    (pos.y - initialOffset.y) / fontSize
                );
                const textElement = textElements[element];
                const textElementCords = [
                    textElement.x,
                    textElement.x +
                        measureTextWidth(textElement.text, fontSize, fontFamily),
                ];
                if (pos.x < textElementCords[0] || pos.x > textElementCords[1])
                    return;
                setHighlights((highlights) => {
                    if (!fontSize) return highlights;
                    const newHighlights = [...highlights];
                    const highlight = newHighlights.find(
                        (highlight) => currentHighlightId === highlight.id
                    );

                    if (!highlight) return highlights;
                    const xPos = calculateXPositionInText(
                        e.target.attrs.text,
                        e.target.attrs.x,
                        pos.x,
                        scale
                    );

                    const yPos = Math.floor(
                        (e.target.attrs.y - initialOffset.y) / fontSize
                    );

                    // Update only if the positions are different
                    highlight.endX = xPos;
                    highlight.endY = yPos;
                    
                    // Update the highlighted text when dragging
                    highlight.highlightedText = extractHighlightedText(
                        processedElements,
                        highlight.startingY,
                        highlight.startingX,
                        highlight.endY,
                        highlight.endX
                    );
                    
                    return newHighlights;
                });
            },
            handleMouseUp() {
                setCurrentHighlight((currentHighlight) =>
                    currentHighlight.creating || currentHighlight.editing
                        ? {
                              id: currentHighlight.id,
                              editing: true,
                              creating: false,
                              mousePosition: currentHighlight.mousePosition,
                              offsetPosition: currentHighlight.offsetPosition,
                          }
                        : {
                              id: undefined,
                              editing: false,
                              creating: false,
                              mousePosition: { x: 0, y: 0 },
                              offsetPosition: { x: 0, y: 0 },
                          }
                );
            },
        }),
        [
            setCurrentHighlight,
            setHighlights,

            currentHighlight,
            activeTool,
            scale,
            offsetPosition,
            settings,
            fontSize,
            fontFamily,
        ]
    );

    const calculateXPositionInText = (
        text: string,
        textStartingX: number,
        mouseStartingX: number,
        scale: number
    ) => {
        if (!settings) return 0;
        const characterWidths = measureCharacterWidths(
            text,
            fontSize,
            settings.fontFamily
        );
        //const textWidth = measureTextWidth(text, fontSize, settings.fontFamily);
        const mouseRelativeX = (mouseStartingX - textStartingX) * scale;
        // Find the character corresponding to the mouse position
        let posInText = 0;

        for (let i = 0; i < characterWidths.length; i++) {
            const { cumulativeWidth } = characterWidths[i];
            if (mouseRelativeX < cumulativeWidth) {
                posInText = i;
                break;
            }
        }

        return posInText;
    };

    useEffect(() => {
        setTextElements(createTextElements());
    }, [processedElements, settings]);

    useEffect(() => {
        setVirtualizedText(
            textElements
                .filter(
                    (element) =>
                        element.x + element.width > visibleArea.x &&
                        element.x < visibleArea.x + visibleArea.width &&
                        element.y + element.height > visibleArea.y &&
                        element.y < visibleArea.y + visibleArea.height
                )
                .map((element, index) => (
                    <Text
                        key={index}
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
    }, [visibleArea, textElements, offsetPosition, scale, settings]);
    const createTextElements = (): BookTextElement[] => {
        if (!settings) return [];
        if (!fontSize) return [];
        // Process the text elements from the book

        // Render the text elements with highlights
        return processedElements.map((textElement) => {
            // Check if this textElement falls within any highlight region

            return {
                id: uuidv4(),
                type: "bookText",
                x: textElement.lineX + initialOffset.x,
                y: textElement.lineY * fontSize + initialOffset.y,
                width: textElement.lineWidth,
                height: fontSize * settings.lineHeight,
                text: textElement.text,
                fontSize: fontSize,
                fill: settings.textColor,
                fontFamily: settings.fontFamily,
                strokeColor: "black",
                strokeWidth: 1,
                opacity: 1,
                outgoingArrowIds: [],
                incomingArrowIds: [],
                points: [
                    {
                        x: textElement.lineX + initialOffset.x,
                        y:
                            textElement.lineY * fontSize * settings.lineHeight +
                            initialOffset.y,
                    },
                    {
                        x:
                            textElement.lineX +
                            textElement.lineWidth +
                            initialOffset.x,
                        y:
                            textElement.lineY * fontSize * settings.lineHeight +
                            initialOffset.y,
                    },
                    {
                        x:
                            textElement.lineX +
                            textElement.lineWidth +
                            initialOffset.x,
                        y:
                            textElement.lineY * fontSize * settings.lineHeight +
                            initialOffset.y +
                            fontSize * settings.lineHeight,
                    },
                    {
                        x: textElement.lineX + initialOffset.x,
                        y:
                            textElement.lineY * fontSize * settings.lineHeight +
                            initialOffset.y +
                            fontSize * settings.lineHeight,
                    },
                ],
            };
        });
    };

    return <>{virtualizedText}</>;
}

export default forwardRef(TextLayer);

// Add this helper function to extract the highlighted text
const extractHighlightedText = (
    elements: ProcessedElement[],
    startY: number,
    startX: number,
    endY: number,
    endX: number
): string => {
    // Ensure proper ordering of start and end positions
    const actualStartY = Math.min(startY, endY);
    const actualEndY = Math.max(startY, endY);
    let actualStartX = startY <= endY ? startX : endX;
    let actualEndX = startY <= endY ? endX : startX;
    
    // Single line highlight
    if (actualStartY === actualEndY) {
        if (actualStartX > actualEndX) {
            [actualStartX, actualEndX] = [actualEndX, actualStartX];
        }
        const line = elements[actualStartY]?.text || '';
        return line.substring(actualStartX, actualEndX + 1);
    }
    
    // Multi-line highlight
    let result = '';
    for (let i = actualStartY; i <= actualEndY; i++) {
        const line = elements[i]?.text || '';
        if (i === actualStartY) {
            // First line - from start position to end of line
            result += line.substring(actualStartX) + ' ';
        } else if (i === actualEndY) {
            // Last line - from start of line to end position
            result += line.substring(0, actualEndX + 1);
        } else {
            // Middle lines - entire line
            result += line + ' ';
        }
    }
    
    return result.trim();
};
