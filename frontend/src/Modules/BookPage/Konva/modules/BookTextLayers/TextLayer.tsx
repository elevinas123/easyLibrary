import {
    ForwardedRef,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import { Text } from "react-konva";
import { v4 as uuidv4 } from "uuid";

import { BookTextElement, VisibleArea } from "../../KonvaStage";
import { measureTextWidth } from "../functions/measureTextWidth";
import { KonvaEventObject } from "konva/lib/Node";
import { useAtom } from "jotai";
import {
    activeToolAtom,
    currentHighlightIdAtom,
    highlightsAtom,
    offsetPositionAtom,
} from "../../konvaAtoms";
import { ProcessedElement } from "./MainLayer";

type TextLayerProps = {
    visibleArea: VisibleArea;
    fontSize: number;
    width: number;
    processedElements: ProcessedElement[];
};

export type TextLayerRef = {
    handleMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseUp: () => void;
};

function TextLayer(
    { visibleArea, fontSize, processedElements }: TextLayerProps,
    ref: ForwardedRef<TextLayerRef>
) {
    const [textElements, setTextElements] = useState<BookTextElement[]>([]);
    const [virtualizedText, setVirtualizedText] = useState<JSX.Element[]>([]);
    const [offsetPosition] = useAtom(offsetPositionAtom);
    const [_, setHighlights] = useAtom(highlightsAtom);
    const [currentHighlightId, setCurrentHighlightId] = useAtom(
        currentHighlightIdAtom
    );
    const [activeTool] = useAtom(activeToolAtom);

    useImperativeHandle(
        ref,
        () => ({
            handleMouseDown(e: KonvaEventObject<MouseEvent>) {
                if (activeTool !== "Select") return;
                const pos = e.target?.getStage()?.getPointerPosition();
                if (!pos) return;
                const currentId = uuidv4();
                setCurrentHighlightId(currentId);
                setHighlights((oldHighlights) => [
                    ...oldHighlights,
                    {
                        id: currentId,
                        startingX: calculateXPositionInText(
                            e.target.attrs.text,
                            e.target.attrs.x + offsetPosition.x,
                            pos.x
                        ),
                        startingY: Math.floor(
                            (e.target.attrs.y - 200) / fontSize
                        ),
                        endX: calculateXPositionInText(
                            e.target.attrs.text,
                            e.target.attrs.x + offsetPosition.x,
                            pos.x
                        ),
                        endY: Math.floor((e.target.attrs.y - 200) / fontSize),
                    },
                ]);
            },
            handleMouseMove(e: KonvaEventObject<MouseEvent>) {
                if (!currentHighlightId) {
                    return;
                }
                const pos = e.target?.getStage()?.getPointerPosition();
                if (!pos) return;
                setHighlights((highlights) => {
                    const newHighlights = [...highlights];
                    const highlight = newHighlights.find(
                        (highlight) => currentHighlightId === highlight.id
                    );

                    if (!highlight) return highlights;

                    const xPos = calculateXPositionInText(
                        e.target.attrs.text,
                        e.target.attrs.x + offsetPosition.x,
                        pos.x
                    );
                    const yPos = Math.floor(
                        (e.target.attrs.y - 200) / fontSize
                    );

                    // Check if the position has actually changed
                    if (highlight.endX === xPos && highlight.endY === yPos) {
                        return highlights; // No change, return the current state
                    }

                    // Update only if the positions are different
                    highlight.endX = xPos;
                    highlight.endY = yPos;

                    return newHighlights;
                });
            },
            handleMouseUp() {
                setCurrentHighlightId(null);
            },
        }),
        [setCurrentHighlightId, setHighlights, currentHighlightId, activeTool]
    );

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
        setTextElements(createTextElements());
    }, [processedElements]);

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
    }, [visibleArea, textElements]);
    const createTextElements = (): BookTextElement[] => {
        // Process the text elements from the book

        // Render the text elements with highlights
        return processedElements.map((textElement) => {
            // Check if this textElement falls within any highlight region

            return {
                id: uuidv4(),
                type: "bookText",
                x: textElement.lineX + 600,
                y: textElement.lineY * fontSize + 200,
                width: textElement.lineWidth,
                height: fontSize,
                text: textElement.text,
                fontSize: fontSize,
                fill: "white",
                fontFamily: "Courier New",
                strokeColor: "black",
                strokeWidth: 1,
                opacity: 1,
                outgoingArrowIds: [],
                incomingArrowIds: [],
                points: [
                    {
                        x: textElement.lineX + 600,
                        y: textElement.lineY * fontSize + 200,
                    },
                    {
                        x: textElement.lineX + textElement.lineWidth + 600,
                        y: textElement.lineY * fontSize + 200,
                    },
                    {
                        x: textElement.lineX + textElement.lineWidth + 600,
                        y: textElement.lineY * fontSize + 200 + fontSize,
                    },
                    {
                        x: textElement.lineX + 600,
                        y: textElement.lineY * fontSize + 200 + fontSize,
                    }
                ]
            };
        });
    };

    return <>{virtualizedText}</>;
}

export default forwardRef(TextLayer);
