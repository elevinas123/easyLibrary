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
import { BookTextElementType } from "../../../../../endPointTypes/types";
import { ProcessedElement } from "../../../../../preprocess/epub/htmlToBookElements";
import { VisibleArea } from "../../KonvaStage";
import { getPos } from "../../functions/getPos";
import { measureTextWidth } from "../../functions/measureTextWidth";
import {
    activeToolAtom,
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

function TextLayer(
    { visibleArea, fontSize, processedElements }: TextLayerProps,
    ref: ForwardedRef<TextLayerRef>
) {
    const [textElements, setTextElements] = useState<BookTextElementType[]>([]);
    const [virtualizedText, setVirtualizedText] = useState<JSX.Element[]>([]);
    const [offsetPosition] = useAtom(offsetPositionAtom);
    const [_, setHighlights] = useAtom(highlightsAtom);
    const [currentHighlight, setCurrentHighlight] =
        useAtom(currentHighlightAtom);
    const [activeTool] = useAtom(activeToolAtom);
    const [scale] = useAtom(scaleAtom);
    const { settings } = useSettings();
    useImperativeHandle(
        ref,
        () => ({
            handleMouseDown(e: KonvaEventObject<MouseEvent>) {
                const pos = getPos(offsetPosition, scale, e);
                if (!pos) return;
                if (activeTool !== "Select") return;
                if (!e.target.attrs.text) return;
                const currentId = uuidv4() as string;
                console.log("textElements", textElements);
                console.log("e.target.attrs.text", e.target);
                console.log("e.target.attrs.y", e.target.attrs.y);
                const element = Math.floor((pos.y - 200) / 16);
                const textElement = textElements[element];
                const textElementCords = [
                    textElement.x,
                    textElement.x +
                        measureTextWidth(textElement.text, settings.fontSize),
                ];
                if (pos.x < textElementCords[0] || pos.x > textElementCords[1])
                    return;
                console.log("element", pos.x, textElementCords);
                setCurrentHighlight({
                    id: currentId,
                    editing: false,
                    creating: true,
                    mousePosition: { x: pos.x, y: pos.y },
                    offsetPosition: { x: e.evt.offsetX, y: e.evt.offsetY },
                });
                setHighlights((oldHighlights) => [
                    ...oldHighlights,
                    {
                        id: currentId,
                        startingX: calculateXPositionInText(
                            e.target.attrs.text,
                            e.target.attrs.x,
                            pos.x,
                            scale
                        ),
                        startingY: Math.floor(
                            (e.target.attrs.y - 200) / fontSize
                        ),
                        endX: calculateXPositionInText(
                            e.target.attrs.text,
                            e.target.attrs.x,
                            pos.x,
                            scale
                        ),
                        endY: Math.floor((e.target.attrs.y - 200) / fontSize),
                    },
                ]);
            },
            handleMouseMove(e: KonvaEventObject<MouseEvent>) {
                if (!currentHighlight.creating) return;
                const currentHighlightId = currentHighlight.id;
                if (!e.target.attrs.text) return;
                const pos = getPos(offsetPosition, scale, e);
                if (!pos) return;
                console.log("cia");
                const element = Math.floor((pos.y - 200) / 16);
                const textElement = textElements[element];
                const textElementCords = [
                    textElement.x,
                    textElement.x +
                        measureTextWidth(textElement.text, settings.fontSize),
                ];
                if (pos.x < textElementCords[0] || pos.x > textElementCords[1])
                    return;
                setHighlights((highlights) => {
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
                        (e.target.attrs.y - 200) / fontSize
                    );

                    // Update only if the positions are different
                    highlight.endX = xPos;
                    highlight.endY = yPos;
                    console.log("highlight", highlight);
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
                              id: null,
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
        ]
    );

    const calculateXPositionInText = (
        text: string,
        textStartingX: number,
        mouseStartingX: number,
        _: number
    ) => {
        const textWidth =
            measureTextWidth(text, fontSize, settings.fontFamily) / text.length;

        const posInText = Math.floor(
            (mouseStartingX - textStartingX) / textWidth
        );
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
    const createTextElements = (): BookTextElementType[] => {
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
                    },
                ],
            };
        });
    };

    return <>{virtualizedText}</>;
}

export default forwardRef(TextLayer);
