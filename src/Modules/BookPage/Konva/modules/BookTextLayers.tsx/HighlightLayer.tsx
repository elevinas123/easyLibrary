import {
    ForwardedRef,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import { Layer, Rect } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import { VisibleArea } from "../../KonvaStage";
import { measureTextWidth } from "../functions/measureTextWidth";
import { useAtom } from "jotai";
import { highlightsAtom } from "../../konvaAtoms";
import { ProcessedElement } from "./MainLayer";
import { KonvaEventObject } from "konva/lib/Node";

type HighlightPoints = {
    x: number;
    y: number;
};
type FullHighlight = {
    rects: HighlightRect[];
    points: HighlightPoints[];
    id: string;
};
type HighlightRect = {
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

    useImperativeHandle(
        ref,
        () => ({
            handleMouseMove(e: KonvaEventObject<MouseEvent>) {
                // Get mouse position
                const mouseX = e.evt.x;
                const mouseY = e.evt.y;

                // Check which highlights the mouse is inside
                const highlightsUnderMouse = highlightElements.filter(
                    (highlight) =>
                        highlight.rects.some((rect) => {
                            return (
                                mouseX >= rect.x &&
                                mouseX <= rect.x + rect.width &&
                                mouseY >= rect.y &&
                                mouseY <= rect.y + rect.height
                            );
                        })
                );

                // Log or handle highlights that the mouse is inside
                if (highlightsUnderMouse.length > 0) {
                    console.log(
                        "Mouse is inside the following highlights:",
                        highlightsUnderMouse
                    );
                } else {
                    console.log("Mouse is not inside any highlight");
                }
            },
        }),
        [highlightElements] // Ensure it re-renders when highlight elements change
    );

    useEffect(() => {
        console.log(createHighlightElements());
        setHighlightElements(createHighlightElements());
    }, [highlights]);
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
                    .flatMap((element) => (
                        <Rect
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
    }, [visibleArea, highlightElements]);

    const createHighlightElements = (): FullHighlight[] => {
        return highlights.map((highlight) => {
            const points: HighlightPoints[] = [];
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
                };
            }
            const rects: HighlightRect[] = [];

            for (let i = 0; i <= range; i++) {
                points.push({ x: 0, y: 0 });
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

            return { id: uuidv4(), points: points, rects: rects };
        });
    };

    return <>{virtualizedHighlights}</>;
}

export default forwardRef(HighlightLayer);
