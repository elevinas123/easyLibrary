import { useAtom } from "jotai";
import {
    activeToolAtom,
    arrowsAtom,
    CanvaElement,
    canvaElementsAtom,
    hoveredItemsAtom,
    newArrowAtom,
    offsetPositionAtom,
    scaleAtom,
    selectedArrowIdsAtom,
} from "../../konvaAtoms";
import { ForwardedRef, forwardRef, useImperativeHandle } from "react";
import { v4 as uuidv4 } from "uuid";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { getPos } from "../../functions/getPos";
import RenderArrow from "./RenderArrow";
import {
    ArrowElementType,
    StartType,
} from "../../../../../endPointTypes/types";
import { Circle } from "react-konva";

type ArrowShapeProps = {
    // Define your prop types here
};

export type ArrowShapeRef = {
    handleMouseDown(e: KonvaEventObject<MouseEvent>): void;
    handleMouseMove(e: KonvaEventObject<MouseEvent>): void;
    handleMouseUp(e: KonvaEventObject<MouseEvent>): void;
    handleElementAttachedToArrowMove(selectedTextId: string[]): void;
    handleArrowSelect(e: KonvaEventObject<MouseEvent>): void;
    handleSelectedArrowMove(id: string, newPoints: number[]): void;
};

function ArrowShape({}: ArrowShapeProps, ref: ForwardedRef<ArrowShapeRef>) {
    const [activeTool] = useAtom(activeToolAtom);
    const [newArrow, setNewArrow] = useAtom(newArrowAtom);
    const [arrows, setArrows] = useAtom(arrowsAtom);
    const [hoveredItems, setHoveredItems] = useAtom(hoveredItemsAtom);
    const [canvasElements] = useAtom(canvaElementsAtom);
    const [offsetPosition] = useAtom(offsetPositionAtom);
    const [scale] = useAtom(scaleAtom); // State to handle scale

    const [selectedArrowIds, setSelectedArrowIds] =
        useAtom(selectedArrowIdsAtom);

    useImperativeHandle(ref, () => ({
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleElementAttachedToArrowMove,
        handleArrowSelect,
        handleSelectedArrowMove,
    }));
    const calculateClosestPointOnShape = (
        element: CanvaElement,
        points: number[]
    ) => {
        const referenceX = points[0];
        const referenceY = points[1];
        let minDistance = Infinity;
        let minPoints = element.points[0];
        element.points.forEach((point) => {
            if (
                distance(point, { x: referenceX, y: referenceY }) < minDistance
            ) {
                minDistance = distance(point, {
                    x: referenceX,
                    y: referenceY,
                });
                minPoints = point;
                console.log("minPoints", minPoints);
            }
        });
        return minPoints;
    };
    // Utility function to calculate the distance between two points
    const distance = (
        point1: { x: number; y: number },
        point2: { x: number; y: number }
    ) => {
        return Math.sqrt(
            (point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2
        );
    };
    const handleElementAttachedToArrowMove = (selectedTextId: string[]) => {
        console.log("canvasElements", canvasElements);
        setArrows((arrows) => {
            const elementsSelected = canvasElements.filter((element) =>
                selectedTextId.includes(element.id)
            );

            const updatingArrows = arrows.filter((arrow) =>
                elementsSelected.some(
                    (element) =>
                        element.id === arrow.startId ||
                        element.id === arrow.endId
                )
            );

            const otherArrows = arrows.filter(
                (arrow) => !updatingArrows.includes(arrow)
            );

            const updatedArrows = updatingArrows.map((arrow) => {
                let updatedPoints = [...arrow.points]; // Clone the points array

                // Find the position of the element for the startId and endId
                const startElement = canvasElements.find(
                    (el) => el.id === arrow.startId
                );
                const endElement = canvasElements.find(
                    (el) => el.id === arrow.endId
                );

                // Update the start position based on the start element's points
                if (startElement && selectedTextId.includes(startElement.id)) {
                    const startPoint = calculateClosestPointOnShape(
                        startElement,
                        arrow.points.slice(2, 4) // Relative to the shape
                    );
                    console.log("Start Point:", startPoint); // Debugging start point
                    updatedPoints[0] = startPoint.x;
                    updatedPoints[1] = startPoint.y;
                }
                if (endElement && selectedTextId.includes(endElement.id)) {
                    const endPoint = calculateClosestPointOnShape(
                        endElement,
                        arrow.points.slice(0, 2) // Relative to the shape
                    );
                    console.log("endElement:", endElement); // Debugging end point
                    console.log("End Point:", endPoint); // Debugging end point
                    updatedPoints[2] = endPoint.x;
                    updatedPoints[3] = endPoint.y;
                }

                return {
                    ...arrow,
                    points: updatedPoints,
                };
            });

            return [...otherArrows, ...updatedArrows];
        });
    };
    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        const pos = getPos(offsetPosition, scale, e);
        if (!pos) return;
        const id = uuidv4();

        const highlightsUnderMouse = hoveredItems.filter((highlight) => {
            return (
                pos.x >= highlight.points[0].x - 10 &&
                pos.x <= highlight.points[1].x &&
                pos.y >= highlight.points[0].y - 10 &&
                pos.y <= highlight.points[2].y + 10
            );
        });
        let startId: null | string = null;
        let type: StartType = null;
        if (highlightsUnderMouse.length > 0) {
            startId = highlightsUnderMouse[0].id;
            if (highlightsUnderMouse[0].points) {
                type = "bookText";
            } else {
                type = "text";
            }
        }
        const arrow: ArrowElementType = {
            id: id,
            startId: startId,
            endId: null,
            points: [pos.x, pos.y],
            startType: type,
            endType: null,
            type: "arrow",
            text: null,
            fill: "black",
            seed: Math.floor(Math.random() * 100000),
            roughness: 1,
            strokeWidth: 2,
            bowing: 0,
            fillStyle: "hachure",
            strokeStyle: "solid",
            stroke: "black",
            hachureAngle: -41,
            hachureGap: 8,
            fillWeight: 1,
        };
        setNewArrow(arrow);
    };
    const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
        if (!newArrow) return;
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;
        let arrow = newArrow;
        const highlightsUnderMouse = hoveredItems.filter((highlight) => {
            if (highlight.rects) {
                return highlight.rects.some((rect) => {
                    return (
                        pos.x >= rect.x - 10 &&
                        pos.x <= rect.x + rect.width + 10 &&
                        pos.y >= rect.y - 10 &&
                        pos.y <= rect.y + rect.height + 10
                    );
                });
            } else {
                return (
                    pos.x >= highlight.points[0].x - 10 &&
                    pos.x <= highlight.points[1].x &&
                    pos.y >= highlight.points[0].y - 10 &&
                    pos.y <= highlight.points[2].y + 10
                );
            }
        });
        if (
            highlightsUnderMouse.length > 0 &&
            highlightsUnderMouse[0].id !== arrow.startId
        ) {
            arrow.endId = highlightsUnderMouse[0].id;
            if (highlightsUnderMouse[0].rects) {
                arrow.endType = "bookText";
            } else {
                arrow.endType = "text";
            }
        }

        setArrows((prevArrows) => [...prevArrows, newArrow]);

        setNewArrow(null);
    };
    const hoverItems = (pos: Vector2d) => {
        const highlightsUnderMouse = canvasElements.filter(
            (textItem) =>
                pos.x >= textItem.x - 10 &&
                pos.x <= textItem.x + textItem.width + 10 &&
                pos.y >= textItem.y - 10 &&
                pos.y <= textItem.y + textItem.height + 10
        );

        if (highlightsUnderMouse.length > 0) {
            const firstHighlight = highlightsUnderMouse[0];

            // Check if the first highlight under the mouse is already hovered
            const isAlreadyHovered = hoveredItems.some(
                (highlight) => highlight.id === firstHighlight.id
            );
            const updatedHighlight = {
                points: [
                    { x: firstHighlight.x, y: firstHighlight.y },
                    {
                        x: firstHighlight.x + firstHighlight.width,
                        y: firstHighlight.y,
                    },
                    {
                        x: firstHighlight.x + firstHighlight.width,
                        y: firstHighlight.y + firstHighlight.height,
                    },
                    {
                        x: firstHighlight.x,
                        y: firstHighlight.y + firstHighlight.height,
                    },
                ],
                id: firstHighlight.id,
            };
            if (isAlreadyHovered) {
                // If it's already hovered, refresh its position in the hovered list
                setHoveredItems((prevHighlights) => [
                    ...prevHighlights.filter(
                        (highlight) => highlight.id !== firstHighlight.id
                    ),
                    updatedHighlight,
                ]);
            } else {
                // If it's a new highlight, update hoveredHighlight to the first highlight under the mouse
                setHoveredItems((prevHighlights) => [
                    ...prevHighlights,
                    updatedHighlight,
                ]);
            }
        }
    };
    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        if (activeTool !== "Arrow") return;
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;
        hoverItems(pos);
        if (!newArrow) {
            return;
        }
        const updatedArrow = {
            ...newArrow,
            points: [newArrow.points[0], newArrow.points[1], pos.x, pos.y],
        };
        setNewArrow(updatedArrow);
    };

    const handleArrowSelect = (e: KonvaEventObject<MouseEvent>) => {
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;
        const arrowUnderMouse = arrows.filter(
            (arrow) =>
                pos.x >= Math.min(arrow.points[0], arrow.points[2]) - 10 &&
                pos.x <= Math.max(arrow.points[0], arrow.points[2]) + 10 &&
                pos.y >= Math.min(arrow.points[1], arrow.points[3]) - 10 &&
                pos.y <= Math.max(arrow.points[1], arrow.points[3]) + 10
        );
        setSelectedArrowIds(arrowUnderMouse.map((arrow) => arrow.id));
    };
    const handleSelectedArrowMove = (id: string, newPoints: number[]) => {
        setArrows((arrows) => {
            return arrows.map((arrow) => {
                if (arrow.id === id) {
                    return { ...arrow, points: newPoints };
                }
                return arrow;
            });
        });
    };
    const handleDragStartPoint = (
        arrowId: string,
        e: KonvaEventObject<MouseEvent>
    ) => {
        e.cancelBubble = true;
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;
        const foundArrow = arrows.find((arrow) => arrow.id === arrowId);
        if (!foundArrow) return;
        hoverItems(pos);
        handleSelectedArrowMove(arrowId, [
            pos.x,
            pos.y,
            foundArrow.points[2],
            foundArrow.points[3],
        ]);
    };

    const handleDragEndPoint = (
        arrowId: string,
        e: KonvaEventObject<MouseEvent>
    ) => {
        e.cancelBubble = true;
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;
        const foundArrow = arrows.find((arrow) => arrow.id === arrowId);
        if (!foundArrow) return;
        hoverItems(pos);
        handleSelectedArrowMove(arrowId, [
            foundArrow.points[0],
            foundArrow.points[1],
            pos.x,
            pos.y,
        ]);
    };

    const handleDragEnd = (
        arrowId: string,
        e: KonvaEventObject<MouseEvent>,
        which: "end" | "start"
    ) => {
        e.cancelBubble = true;
        const arrow = arrows.find((arrow) => arrow.id === arrowId);
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;
        if (!arrow) return;
        const highlightsUnderMouse = hoveredItems.filter((highlight) => {
            if (highlight.rects) {
                return highlight.rects.some((rect) => {
                    return (
                        pos.x >= rect.x - 10 &&
                        pos.x <= rect.x + rect.width + 10 &&
                        pos.y >= rect.y - 10 &&
                        pos.y <= rect.y + rect.height + 10
                    );
                });
            } else {
                return (
                    pos.x >= highlight.points[0].x - 10 &&
                    pos.x <= highlight.points[1].x &&
                    pos.y >= highlight.points[0].y - 10 &&
                    pos.y <= highlight.points[2].y + 10
                );
            }
        });
        console.log("highlightsUnderMouse", highlightsUnderMouse, which);
        if (which === "start") {
            if (highlightsUnderMouse.length > 0) {
                arrow.startId = highlightsUnderMouse[0].id;
                if (highlightsUnderMouse[0].rects) {
                    arrow.startType = "bookText";
                } else {
                    arrow.startType = "text";
                }
            } else {
                arrow.startId = null;
                arrow.startType = null;
            }
        }
        if (which === "end") {
            if (highlightsUnderMouse.length > 0) {
                arrow.endId = highlightsUnderMouse[0].id;
                if (highlightsUnderMouse[0].rects) {
                    arrow.endType = "bookText";
                } else {
                    arrow.endType = "text";
                }
            } else {
                arrow.endId = null;
                arrow.endType = null;
            }
        }
        setArrows((prevArrows) => {
            return prevArrows.map((prevArrow) => {
                if (prevArrow.id === arrow.id) {
                    return arrow;
                } else {
                    return prevArrow;
                }
            });
        });
    };

    return (
        <>
            {arrows.map((arrow) => (
                <RenderArrow
                    element={arrow}
                    draggable={false}
                    handleDragMove={undefined}
                />
            ))}

            {selectedArrowIds.map((id) => {
                const selectedArrow = arrows.find((arrow) => arrow.id === id);
                if (!selectedArrow) return null;

                return (
                    <>
                        {/* Draggable Start Point - Circle */}
                        <Circle
                            key={`start-${id}`}
                            x={selectedArrow.points[0]}
                            y={selectedArrow.points[1]}
                            radius={8} // Adjust size to make it look like Excalidraw
                            fill="blue" // Color for the start point
                            stroke="white" // White stroke around the circle for better visibility
                            strokeWidth={2} // Thickness of the stroke
                            draggable
                            onDragEnd={(e) => handleDragEnd(id, e, "start")}
                            onDragMove={(e) => handleDragStartPoint(id, e)}
                        />

                        {/* Draggable End Point - Circle */}
                        <Circle
                            key={`end-${id}`}
                            x={selectedArrow.points[2]}
                            y={selectedArrow.points[3]}
                            radius={8} // Adjust size to make it look like Excalidraw
                            fill="red" // Color for the end point
                            stroke="white" // White stroke around the circle for better visibility
                            strokeWidth={2} // Thickness of the stroke
                            draggable
                            onDragEnd={(e) => handleDragEnd(id, e, "end")}
                            onDragMove={(e) => handleDragEndPoint(id, e)}
                        />
                    </>
                );
            })}

            {newArrow && newArrow.points && (
                <RenderArrow
                    element={newArrow}
                    draggable={false}
                    handleDragMove={undefined}
                />
            )}
        </>
    );
}

export default forwardRef(ArrowShape);
