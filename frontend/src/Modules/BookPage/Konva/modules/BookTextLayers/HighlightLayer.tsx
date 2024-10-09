import { useAtom } from "jotai";
import { KonvaEventObject } from "konva/lib/Node";
import {
    ForwardedRef,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import { Rect } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import { ProcessedElement } from "../../../../../preprocess/epub/htmlToBookElements";
import { VisibleArea } from "../../KonvaStage";
import { getPos } from "../../functions/getPos";
import { measureTextWidth } from "../../functions/measureTextWidth";
import {
    activeToolAtom,
    HighlightPoints,
    highlightsAtom,
    hoveredItemsAtom,
    offsetPositionAtom,
    scaleAtom,
} from "../../konvaAtoms";

export type FullHighlight = {
    rects: HighlightRect[];
    points: HighlightPoints[];
    id: string;
    type: "bookText";
};

export type HighlightRect = {
    y: number;
    x: number;
    width: number;
    height: number;
    fill: string;
    opacity: number;
};
type HighlightLayerProps = {
    visibleArea: VisibleArea;
    fontSize: number;
    processedElements: ProcessedElement[];
};

export type HighlightLayerRef = {
    handleMouseMove(e: KonvaEventObject<MouseEvent>): void;
};

function HighlightLayer(
    { visibleArea, fontSize, processedElements }: HighlightLayerProps,
    ref: ForwardedRef<HighlightLayerRef>
) {
    const [highlights] = useAtom(highlightsAtom);

    const [highlightElements, setHighlightElements] = useState<FullHighlight[]>(
        []
    );
    const [virtualizedHighlights, setVirtualizedHighlights] = useState<
        JSX.Element[]
    >([]);
    const [hoveredItems, setHoveredItems] = useAtom(hoveredItemsAtom);
    const [activeTool] = useAtom(activeToolAtom);
    const [scale] = useAtom(scaleAtom);
    const [offsetPosition] = useAtom(offsetPositionAtom);

    useImperativeHandle(
        ref,
        () => ({
            handleMouseMove(e: KonvaEventObject<MouseEvent>) {
                if (activeTool !== "Arrow") return;
                const pos = getPos(offsetPosition, scale, e);
                if (!pos) return;
                const highlightsUnderMouse = highlightElements.filter(
                    (highlight) =>
                        highlight.rects.some((rect) => {
                            return (
                                pos.x >= rect.x - 10 &&
                                pos.x <= rect.x + rect.width + 10 &&
                                pos.y >= rect.y - 10 &&
                                pos.y <= rect.y + rect.height + 10
                            );
                        })
                );
                if (highlightsUnderMouse.length > 0) {
                    const firstHighlight = highlightsUnderMouse[0];

                    // Check if the first highlight under the mouse is already hovered
                    const isAlreadyHovered = hoveredItems.some(
                        (highlight) => highlight.id === firstHighlight.id
                    );

                    if (isAlreadyHovered) {
                        // If it's already hovered, refresh its position in the hovered list
                        setHoveredItems((prevHighlights) => [
                            ...prevHighlights.filter(
                                (highlight) =>
                                    highlight.id !== firstHighlight.id
                            ),
                            firstHighlight,
                        ]);
                    } else {
                        // If it's a new highlight, update hoveredHighlight to the first highlight under the mouse
                        setHoveredItems((prevHighlights) => [
                            ...prevHighlights,
                            firstHighlight,
                        ]);
                    }
                } else {
                    // If no highlights are under the mouse and hoveredHighlight exists, do nothing
                    if (!hoveredItems) {
                        return;
                    }
                }
            },
        }),
        [highlightElements, hoveredItems, activeTool, scale, offsetPosition, fontSize]
    );

    useEffect(() => {
        setHighlightElements(createHighlightElements());
    }, [highlights, fontSize]);
    useEffect(() => {
        setVirtualizedHighlights(
            highlightElements.flatMap((highlightElement) =>
                highlightElement.rects
                    .filter(
                        (element) =>
                            element.x + element.width > visibleArea.x &&
                            element.x < visibleArea.x + visibleArea.width &&
                            element.y + element.height > visibleArea.y &&
                            element.y < visibleArea.y + visibleArea.height
                    )
                    .flatMap((element, index) => (
                        <Rect
                            key={highlightElement.id + index}
                            x={element.x}
                            y={element.y}
                            width={element.width}
                            height={element.height}
                            fill={element.fill}
                            opacity={element.opacity}
                        />
                    ))
            )
        );
    }, [visibleArea, highlightElements, fontSize]);

    const createHighlightElements = (): FullHighlight[] => {
        console.log("creating highlights", fontSize);
        return highlights.map((highlight) => {
            const points: HighlightPoints[] = [];
            const range = highlight.endY - highlight.startingY;
            if (range === 0) {
                const letterWidth =
                    measureTextWidth(
                        processedElements[highlight.startingY].text, fontSize
                    ) / processedElements[highlight.startingY].text.length;
                let currentX = highlight.startingX * letterWidth;
                let lineWidth =
                    (highlight.endX - highlight.startingX) * letterWidth +
                    letterWidth;
                points.push({
                    x: currentX + 600,
                    y: highlight.startingY * fontSize + 200,
                });
                points.push({
                    x: currentX + lineWidth + 600,
                    y: highlight.startingY * fontSize + 200,
                });
                points.push({
                    x: currentX + lineWidth + 600,
                    y: highlight.startingY * fontSize + 200 + fontSize,
                });
                points.push({
                    x: currentX + 600,
                    y: highlight.startingY * fontSize + 200 + fontSize,
                });
                const rects = [];
                rects.push({
                    y: highlight.startingY * fontSize + 200,
                    x: currentX + 600,
                    width: lineWidth,
                    height: fontSize,
                    fill: "yellow",
                    opacity: 0.5,
                    points: points,
                });
                return {
                    id: uuidv4(),
                    points: points,
                    rects: rects,
                    type: "bookText",
                };
            }
            const rects: HighlightRect[] = [];

            for (let i = 0; i <= range; i++) {
                points.push({ x: 0, y: 0 });
                const letterWidth =
                    measureTextWidth(
                        processedElements[highlight.startingY].text, fontSize
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

            return {
                id: uuidv4(),
                points: points,
                rects: rects,
                type: "bookText",
            };
        });
    };

    return <>{virtualizedHighlights}</>;
}

export default forwardRef(HighlightLayer);
