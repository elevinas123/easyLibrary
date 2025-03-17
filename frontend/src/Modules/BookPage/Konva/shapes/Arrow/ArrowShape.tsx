import { useAtom } from "jotai";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle } from "react";
import { Circle } from "react-konva";
import { v4 as uuidv4 } from "uuid";

import {
    CanvaElementSkeleton,
    Point,
    ProcessedElement,
    SpecificArrowElement,
    StartType,
} from "../../../../../endPointTypes/types";
import { getArrowHighlightsUnderMouse } from "../../functions/getElementsUnderMouse";
import { getPos } from "../../functions/getPos";
import {
    activeToolAtom,
    arrowsAtom,
    bookIdAtom,
    canvaElementsAtom,
    hoveredItemsAtom,
    newArrowAtom,
    offsetPositionAtom,
    scaleAtom,
    selectedArrowIdsAtom,
} from "../../konvaAtoms";
import createArrow from "./CreateArrow";
import RenderArrow from "./RenderArrow";

type ArrowShapeProps = {
    // Define your prop types here
};

export type ArrowShapeRef = {
    handleMouseDown(e: KonvaEventObject<MouseEvent>): void;
    handleMouseMove(e: KonvaEventObject<MouseEvent>): void;
    handleMouseUp(e: KonvaEventObject<MouseEvent>): void;
    handleElementAttachedToArrowMove(selectedTextId: string[]): void;
    handleArrowSelect(e: KonvaEventObject<MouseEvent>): void;
    handleSelectedArrowMove(id: string, newPoints: Point[]): void;
};

function ArrowShape({}: ArrowShapeProps, ref: ForwardedRef<ArrowShapeRef>) {
    const [activeTool] = useAtom(activeToolAtom);
    const [newArrow, setNewArrow] = useAtom(newArrowAtom);
    const [arrows, setArrows] = useAtom(arrowsAtom);
    const [hoveredItems, setHoveredItems] = useAtom(hoveredItemsAtom);
    const [canvasElements] = useAtom(canvaElementsAtom);
    const [offsetPosition] = useAtom(offsetPositionAtom);
    const [scale] = useAtom(scaleAtom); // State to handle scale
    const [bookId] = useAtom(bookIdAtom);
    const [selectedArrowIds, setSelectedArrowIds] =
        useAtom(selectedArrowIdsAtom);
    useEffect(() => {
        console.log("naujas cia arrows", arrows);
    }, [arrows]);
    useImperativeHandle(ref, () => ({
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleElementAttachedToArrowMove,
        handleArrowSelect,
        handleSelectedArrowMove,
    }));
    const calculateClosestPointOnShape = (
        element: CanvaElementSkeleton,
        points: Point[]
    ) => {
        if (!element.points) return { x: 0, y: 0 };
        let minDistance = Infinity;
        let minPoints = element.points[0];
        element.points.forEach((point) => {
            if (distance(point, points[0]) < minDistance) {
                minDistance = distance(point, points[0]);
                minPoints = point;
                console.log("minPoints", minPoints);
            }
        });
        return minPoints;
    };
    // Utility function to calculate the distance between two points
    const distance = (point1: Point, point2: Point) => {
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
                        element.id === arrow.arrowElement.startId ||
                        element.id === arrow.arrowElement.endId
                )
            );

            const otherArrows = arrows.filter(
                (arrow) => !updatingArrows.includes(arrow)
            );

            const updatedArrows = updatingArrows.map((arrow) => {
                let updatedPoints = [...arrow.points]; // Clone the points array

                // Find the position of the element for the startId and endId
                const startElement = canvasElements.find(
                    (el) => el.id === arrow.arrowElement.startId
                );
                const endElement = canvasElements.find(
                    (el) => el.id === arrow.arrowElement.endId
                );

                // Update the start position based on the start element's points
                if (startElement && selectedTextId.includes(startElement.id)) {
                    const startPoint = calculateClosestPointOnShape(
                        startElement,
                        arrow.points.slice(2, 4) // Relative to the shape
                    );
                    console.log("Start Point:", startPoint); // Debugging start point
                    updatedPoints[0] = startPoint;
                }
                if (endElement && selectedTextId.includes(endElement.id)) {
                    const endPoint = calculateClosestPointOnShape(
                        endElement,
                        arrow.points.slice(0, 2) // Relative to the shape
                    );
                    console.log("endElement:", endElement); // Debugging end point
                    console.log("End Point:", endPoint); // Debugging end point
                    updatedPoints[1] = endPoint;
                }

                return {
                    ...arrow,
                    points: updatedPoints,
                };
            });

            return [...otherArrows, ...updatedArrows];
        });
    };
    // Add a helper function to extract text content based on element type
    const getElementText = (element: CanvaElementSkeleton | undefined): string => {
        console.log("element", element)
        if (!element) return "Unknown";
        console.log("element.type", element.type)
        // Text element content is in the textElement.text property
        if (element.type === 'text' && element.textElement) {
            return element.textElement.text || "Text Element";
        }
        
        // For book text highlights, we need to get the text from the content
        if (element.type === 'bookText' && element.content) {
            return element.content || "Book Text";
        }
        
        // For shapes, we can use a default description or any associated label
        if (element.type === 'rect') {
            console.log("rect", element)
            return "Rectangle Shape";
        }
        
        if (element.type === 'circle') {
            return "Circle Shape";
        }
        console.log("element.type", element.type)
        
        // Fall back to a descriptive string based on type
        return `${element.type || "Unknown"} Element`;
    };
    useEffect(() => {
      console.log("Hovered items", hoveredItems);
    }, [hoveredItems]);
    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (!bookId) return;
        const pos = getPos(offsetPosition, scale, e);
        if (!pos) return;
        const id = uuidv4();

        console.log("Mouse down at position:", pos);

        const highlightsUnderMouse = getArrowHighlightsUnderMouse(
            hoveredItems,
            pos
        );
        let startId: string | undefined = undefined;
        let type: StartType = undefined;
        console.log("highlightsUnderMouse", highlightsUnderMouse);
        if (highlightsUnderMouse.length > 0) {
            startId = highlightsUnderMouse[0].id;
            if (!highlightsUnderMouse[0].type) {
                type = "text";
            } else {
                type = highlightsUnderMouse[0].type;
            }
        }
        const arrow = createArrow({
            points: [
                { x: pos.x, y: pos.y },
                { x: pos.x, y: pos.y },
            ],
            bookId: bookId,
            startId,
            startType: type,
            id,
        });
        console.log("Created new arrow:", arrow);
        setNewArrow(arrow);
    };
    const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
        if (!newArrow) {
            console.log("No new arrow to complete");
            return;
        }
        const pos = getPos(offsetPosition, scale, e);
        console.log("Mouse up at position:", pos);

        if (!pos) return;
        let arrow = {...newArrow}; // Create copy to avoid direct mutation
        const highlightsUnderMouse = getArrowHighlightsUnderMouse(
            hoveredItems,
            pos
        );
        
        // Get the end element if there's one under the mouse
        if (
            highlightsUnderMouse.length > 0 &&
            highlightsUnderMouse[0].id !== arrow.arrowElement.startId
        ) {
            arrow.arrowElement.endId = highlightsUnderMouse[0].id;
            if (highlightsUnderMouse[0].type) {
                arrow.arrowElement.endType = highlightsUnderMouse[0].type;
            } else {
                arrow.arrowElement.endType = "unknown";
            }
            
            // Find the start and end elements to extract their text content
            const startElement = canvasElements.find(
                (element) => element.id === arrow.arrowElement.startId
            );
            
            const endElement = canvasElements.find(
                (element) => element.id === arrow.arrowElement.endId
            );
            const startText = getElementText(startElement);
            const endText = getElementText(endElement);
            console.log("newFrom here startElement", startElement)
            console.log("newFrom here endElement", endElement)
            console.log("newFrom here startText", startText)
            console.log("newFrom here endText", endText)
            // Add text content to the arrow
            arrow.arrowElement.startText = startText;
            arrow.arrowElement.endText = endText;
        }

        console.log("Saving final arrow:", arrow);
        setArrows((prevArrows) => [...prevArrows, arrow]);
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
                type: firstHighlight.type,
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
        if (activeTool !== "Arrow" && activeTool !== "Select") return;
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;
        hoverItems(pos);
        if (!newArrow) {
            return;
        }
        const updatedArrow: SpecificArrowElement = {
            ...newArrow,
            points: [newArrow.points[0], { x: pos.x, y: pos.y }],
        };
        setNewArrow(updatedArrow);
    };

    const handleArrowSelect = (e: KonvaEventObject<MouseEvent>) => {
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;
        const arrowUnderMouse = arrows.filter(
            (arrow) =>
                pos.x >= Math.min(arrow.points[0].x, arrow.points[1].x) - 10 &&
                pos.x <= Math.max(arrow.points[0].x, arrow.points[1].x) + 10 &&
                pos.y >= Math.min(arrow.points[0].y, arrow.points[1].y) - 10 &&
                pos.y <= Math.max(arrow.points[0].y, arrow.points[1].y) + 10
        );
        setSelectedArrowIds(arrowUnderMouse.map((arrow) => arrow.id));
    };
    const handleSelectedArrowMove = (id: string, newPoints: Point[]) => {
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
        e.cancelBubble = false;
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;
        const foundArrow = arrows.find((arrow) => arrow.id === arrowId);
        if (!foundArrow) return;
        hoverItems(pos);
        handleSelectedArrowMove(arrowId, [
            { x: pos.x, y: pos.y },
            foundArrow.points[1],
        ]);
    };

    const handleDragEndPoint = (
        arrowId: string,
        e: KonvaEventObject<MouseEvent>
    ) => {
        e.cancelBubble = false;
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;
        const foundArrow = arrows.find((arrow) => arrow.id === arrowId);
        if (!foundArrow) return;
        hoverItems(pos);
        handleSelectedArrowMove(arrowId, [
            foundArrow.points[0],
            { x: pos.x, y: pos.y },
        ]);
    };

    const handleDragEnd = (
        arrowId: string,
        e: KonvaEventObject<MouseEvent>,
        which: "end" | "start"
    ) => {
        e.cancelBubble = false;
        const arrowToUpdate = arrows.find((arrow) => arrow.id === arrowId);
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;
        if (!arrowToUpdate) return;
        
        // Create a copy of the arrow for immutability
        const updatedArrow = { 
            ...arrowToUpdate,
            arrowElement: { ...arrowToUpdate.arrowElement }
        };
        
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
                updatedArrow.arrowElement.startId = highlightsUnderMouse[0].id;
                if (highlightsUnderMouse[0].type) {
                    updatedArrow.arrowElement.startType = highlightsUnderMouse[0].type;
                } else {
                    updatedArrow.arrowElement.startType = "unknown";
                }
                
                // Update the start text when the element changes
                const startElement = canvasElements.find(
                    (element) => element.id === updatedArrow.arrowElement.startId
                );
                updatedArrow.arrowElement.startText = getElementText(startElement);
            } else {
                updatedArrow.arrowElement.startId = undefined;
                updatedArrow.arrowElement.startType = undefined;
                updatedArrow.arrowElement.startText = "Unconnected";
            }
        }
        if (which === "end") {
            if (highlightsUnderMouse.length > 0) {
                updatedArrow.arrowElement.endId = highlightsUnderMouse[0].id;
                if (highlightsUnderMouse[0].type) {
                    updatedArrow.arrowElement.endType = highlightsUnderMouse[0].type;
                } else {
                    updatedArrow.arrowElement.endType = "unknown";
                }
                
                // Update the end text when the element changes
                const endElement = canvasElements.find(
                    (element) => element.id === updatedArrow.arrowElement.endId
                );
                updatedArrow.arrowElement.endText = getElementText(endElement);
            } else {
                updatedArrow.arrowElement.endId = undefined;
                updatedArrow.arrowElement.endType = undefined;
                updatedArrow.arrowElement.endText = "Unconnected";
            }
        }

        setArrows((prevArrows) => 
            prevArrows.map((prevArrow) => 
                prevArrow.id === arrowId ? updatedArrow : prevArrow
            )
        );
    };

    return (
        <>
            {arrows.map((arrow) => (
                <RenderArrow key={arrow.id} element={arrow} />
            ))}

            {selectedArrowIds.map((id) => {
                const selectedArrow = arrows.find((arrow) => arrow.id === id);
                if (!selectedArrow) return null;

                return (
                    <>
                        {/* Draggable Start Point - Circle */}
                        <Circle
                            key={`start-${id}`}
                            x={selectedArrow.points[0].x}
                            y={selectedArrow.points[0].y}
                            radius={8} // Adjust size to make it look like Excalidraw
                            fill="blue" // Color for the start point
                            stroke="white" // White stroke around the circle for better visibility
                            strokeWidth={2} // Thickness of the stroke
                            draggable
                            dragBoundFunc={() => {
                                return {
                                    x: selectedArrow.points[1].x,
                                    y: selectedArrow.points[1].y,
                                };
                            }}
                            onDragEnd={(e) => handleDragEnd(id, e, "start")}
                            onDragMove={(e) => handleDragStartPoint(id, e)}
                        />

                        {/* Draggable End Point - Circle */}
                        <Circle
                            key={`end-${id}`}
                            x={selectedArrow.points[1].x}
                            y={selectedArrow.points[1].y}
                            radius={8} // Adjust size to make it look like Excalidraw
                            fill="red" // Color for the end point
                            stroke="white" // White stroke around the circle for better visibility
                            strokeWidth={2} // Thickness of the stroke
                            draggable
                            dragBoundFunc={() => {
                                return {
                                    x: selectedArrow.points[0].x,
                                    y: selectedArrow.points[0].y,
                                };
                            }}
                            onDragEnd={(e) => handleDragEnd(id, e, "end")}
                            onDragMove={(e) => handleDragEndPoint(id, e)}
                        />
                    </>
                );
            })}

            {newArrow && newArrow.points && <RenderArrow element={newArrow} />}
        </>
    );
}

export default forwardRef(ArrowShape);
