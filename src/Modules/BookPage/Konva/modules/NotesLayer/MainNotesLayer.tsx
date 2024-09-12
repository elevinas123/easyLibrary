import { useAtom } from "jotai";
import { Layer, Arrow, Text } from "react-konva";
import {
    ForwardedRef,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
    useRef,
} from "react";
import {
    activeToolAtom,
    arrowsAtom,
    canvaElementsAtom,
    hoveredItemsAtom,
    newArrowAtom,
} from "../../konvaAtoms";
import { KonvaEventObject } from "konva/lib/Node";
import { v4 as uuidv4 } from "uuid";

import { Html } from "react-konva-utils";
import { ArrowElement, StartType, TextElement } from "../../KonvaStage";

type MainNotesLayerProps = {
    // Define your prop types here
};

export type ShapeType = "Rectangle" | "Circle" | "Arrow" | "Line" | "Text";

export type MainNotesLayerRef = {
    handleMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
    handleDoubleClick: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseUp: (e: KonvaEventObject<MouseEvent>) => void;
    handleKeyDown: (e: KeyboardEvent) => void;
};

function MainNotesLayer(
    {}: MainNotesLayerProps,
    ref: ForwardedRef<MainNotesLayerRef>
) {
    const [activeTool] = useAtom(activeToolAtom);
    const [arrows, setArrows] = useAtom(arrowsAtom);
    const [newArrow, setNewArrow] = useAtom(newArrowAtom);
    const [selectedTextId, setSelectedTextId] = useState<string | null>(null); // Track selected text
    const [isEditing, setIsEditing] = useState<boolean>(false); // Track if text is being edited
    const [hoveredItems, setHoveredItems] = useAtom(hoveredItemsAtom);
    const [canvasElements, setCanvaElements] = useAtom(canvaElementsAtom);

    const inputRef = useRef<HTMLInputElement>(null);
    // Handle Mouse Down
    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (activeTool === "Arrow") {
            const pos = e.target?.getStage()?.getPointerPosition();
            if (!pos) return;
            const id = uuidv4();

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
            let startId: null | string = null;
            let type: StartType = null;
            if (highlightsUnderMouse.length > 0) {
                startId = highlightsUnderMouse[0].id;
                if (highlightsUnderMouse[0].rects) {
                    type = "bookText";
                } else {
                    type = "text";
                }
            }
            const arrow: ArrowElement = {
                id: id,
                startId: startId,
                endId: null,
                points: [pos.x, pos.y],
                startType: type,
                endType: null,
                type: "arrow",
                text: null,
                fill: "black",
            };
            setNewArrow(arrow);
        } else if (activeTool === "Text") {
            const pos = e.target?.getStage()?.getPointerPosition();
            if (!pos) return;
            const id = uuidv4();
            const newItem: TextElement = {
                id,
                text: "New Text",
                x: pos.x,
                y: pos.y,
                fontSize: 24,
                width: 24 * 8 + 10,
                height: 24 + 10,
                type: "text",
                fontFamily: "Arial",
                fill: "black",
                outgoingArrowIds: [],
                incomingArrowIds: [],
            };
            setCanvaElements((elements) => [...elements, newItem]);
            setSelectedTextId(id);
            setIsEditing(true);
        } else {
            setSelectedTextId(null); // Deselect text when clicking elsewhere
        }
    };
    useEffect(() => {
        console.log(inputRef.current, isEditing, selectedTextId);
        if (inputRef.current && isEditing && selectedTextId) {
            console.log("cia");
            const textItems = canvasElements.filter(
                (item) => item.type === "text"
            );
            const selectedItem = textItems.filter(
                (item) => item.id === selectedTextId
            );

            if (selectedItem && selectedItem.length > 0) {
                const textItem = selectedItem[0];
                const input = inputRef.current;

                input.style.left = `${textItem.x}px`;
                input.style.top = `${textItem.y}px`;
                input.style.fontSize = `${textItem.fontSize}px`;
                input.style.display = "block";
                input.value = textItem.text;
                input.style.fontSize = `${textItem.fontSize}px`;
                input.style.width = `${textItem.width}px`;
                input.focus();

                return;
            }
        }
        handleInputBlur();
    }, [isEditing, selectedTextId, canvasElements]);

    // Handle Text Double Click for Editing

    // Handle Input Change and Save Text
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedTextId) return;
        const updatedTextItems = canvasElements.map((item) =>
            item.id === selectedTextId
                ? {
                      ...item,
                      text: e.target.value,
                      width: e.target.value.length * 24 + 20,
                  }
                : item
        );
        setCanvaElements(updatedTextItems);
    };

    const handleInputBlur = () => {
        if (inputRef.current) {
            inputRef.current.style.display = "none";
        }
    };

    // Handle Delete Key Press
    const handleKeyDown = (e: KeyboardEvent) => {
        if (isEditing) return;
        if (e.key === "Delete" || e.key === "Backspace") {
            if (selectedTextId) {
                setCanvaElements((prevItems) =>
                    prevItems.filter((item) => item.id !== selectedTextId)
                );
                setSelectedTextId(null);
            }
        }
    };

    // Handle Mouse Move for Arrows (Existing)
    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        if (activeTool !== "Arrow") return;

        const pos = e.target?.getStage()?.getPointerPosition();
        if (!pos) return;
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
        if (!newArrow) {
            return;
        }
        const updatedArrow = {
            ...newArrow,
            points: [newArrow.points[0], newArrow.points[1], pos.x, pos.y],
        };
        setNewArrow(updatedArrow);
    };

    // Handle Mouse Up for Arrows (Existing)
    const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
        if (!newArrow) return;
        const pos = e.target?.getStage()?.getPointerPosition();
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
    useEffect(() => {
        console.log("arrows", arrows);
    }, [arrows]);
    const handleDoubleClick = (e: KonvaEventObject<MouseEvent>) => {
        canvasElements.forEach((textItem) => {
            const isInsideXBounds =
                e.evt.x >= textItem.x && e.evt.x <= textItem.x + textItem.width;
            const isInsideYBounds =
                e.evt.y >= textItem.y &&
                e.evt.y <= textItem.y + textItem.height;

            if (isInsideXBounds && isInsideYBounds) {
                setIsEditing(true);
                setSelectedTextId(textItem.id);
                return;
            }
        });
    };

    useImperativeHandle(ref, () => ({
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleKeyDown,
        handleDoubleClick,
    }));

    return (
        <>
            <Layer>
                <Html>
                    <input
                        ref={inputRef}
                        type="text"
                        style={{
                            display: "none",
                            position: "absolute",
                            backgroundColor: "#27272a", // zinc-800
                            color: "#d1d5db", // gray-300
                            border: "0", // gray-300 border
                            outline: "none", // Removes default outline for focus states
                        }}
                        onChange={handleInputChange}
                    />
                </Html>
                {/* Render arrows */}
                {arrows.map((arrow, i) => (
                    <Arrow
                        key={i}
                        points={arrow.points}
                        stroke="black"
                        fill="black"
                        pointerLength={10}
                        pointerWidth={10}
                        lineCap="round"
                        lineJoin="round"
                    />
                ))}
                {newArrow && newArrow.points && (
                    <Arrow
                        points={newArrow.points}
                        stroke="black"
                        fill="black"
                        pointerLength={10}
                        pointerWidth={10}
                        lineCap="round"
                        lineJoin="round"
                    />
                )}
                {/* Render text items */}
                {canvasElements
                    .filter((element) => element.type === "text")
                    .map((textItem) => (
                        <Text
                            key={textItem.id}
                            text={textItem.text}
                            x={textItem.x}
                            y={textItem.y}
                            fontSize={textItem.fontSize}
                            fill={
                                selectedTextId === textItem.id
                                    ? "blue"
                                    : "black"
                            }
                        />
                    ))}
            </Layer>
        </>
    );
}

export default forwardRef(MainNotesLayer);
