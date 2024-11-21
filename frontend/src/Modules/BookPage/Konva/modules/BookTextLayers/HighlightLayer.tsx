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
        [
            highlightElements,
            hoveredItems,
            activeTool,
            scale,
            offsetPosition,
            fontSize,
        ]
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
        return highlights.map((highlight) => {
            const rects: HighlightRect[] = [];

            // Determine the actual start and end positions
            const startY = Math.min(highlight.startingY, highlight.endY);
            const endY = Math.max(highlight.startingY, highlight.endY);

            let startX, endX;

            // Adjust startingX and endX based on the direction
            if (highlight.startingY < highlight.endY) {
                startX = highlight.startingX;
                endX = highlight.endX;
            } else if (highlight.startingY > highlight.endY) {
                startX = highlight.endX;
                endX = highlight.startingX;
            } else {
                // Same line, adjust startX and endX
                startX = Math.min(highlight.startingX, highlight.endX);
                endX = Math.max(highlight.startingX, highlight.endX);
            }

            const range = endY - startY;

            const leftPoints = [];
            const rightPoints = [];

            // Collect points and rects in one loop
            for (let i = 0; i <= range; i++) {
                const currentLineIndex = startY + i;
                const text = processedElements[currentLineIndex].text;
                const letterWidth =
                    measureTextWidth(text, fontSize) / text.length;

                let currentX = 0;
                let lineWidth = text.length * letterWidth;

                if (i === 0) {
                    // First line
                    currentX = startX * letterWidth;
                    if (range === 0) {
                        // Single-line highlight
                        lineWidth = (endX - startX + 1) * letterWidth;
                    } else {
                        lineWidth = text.length * letterWidth - currentX;
                    }
                } else if (i === range) {
                    // Last line
                    currentX = 0;
                    lineWidth = (endX + 1) * letterWidth;
                } else {
                    // Middle lines (full line)
                    currentX = 0;
                    lineWidth = text.length * letterWidth;
                }

                const x = currentX + 600;
                const y = currentLineIndex * fontSize + 200;
                const height = fontSize;

                // Add rectangle to rects array
                rects.push({
                    y: y,
                    x: x,
                    width: lineWidth,
                    height: height,
                    fill: "yellow",
                    opacity: 0.5,
                });

                // Collect the left and right points
                leftPoints.push({ x: x, y: y }); // Top-left corner
                leftPoints.push({ x: x, y: y + height }); // Bottom-left corner
                rightPoints.push({ x: x + lineWidth, y: y }); // Top-right corner
                rightPoints.push({ x: x + lineWidth, y: y + height }); // Bottom-right corner

                // Collect the bottom points
            }
            leftPoints.reverse();
            // Reverse the leftPoints to maintain clockwise order
            // Combine the points
            const polygonPoints = [
                leftPoints[leftPoints.length - 1],
                ...rightPoints,
                ...leftPoints.slice(0, leftPoints.length - 1),
            ];
            console.log("points", polygonPoints);

            return {
                id: uuidv4(),
                points: polygonPoints,
                rects: rects,
                type: "bookText",
            };
        });
    };

    return <>{virtualizedHighlights}</>;
}
export default forwardRef(HighlightLayer);
