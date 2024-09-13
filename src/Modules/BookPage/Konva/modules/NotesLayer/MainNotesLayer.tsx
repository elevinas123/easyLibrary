import { useAtom } from "jotai";
import { Layer, Text } from "react-konva";
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
    canvaElementsAtom,
    selectedArrowIdsAtom,
} from "../../konvaAtoms";
import { KonvaEventObject } from "konva/lib/Node";
import { v4 as uuidv4 } from "uuid";

import { Html } from "react-konva-utils";
import { TextElement } from "../../KonvaStage";
import CustomTransformer from "../../shapes/CustomTransformer";
import ArrowShape, { ArrowShapeRef } from "../../shapes/ArrowShape";
import CustomArrowTransformer from "../../shapes/CustomArrowsTransformer";

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
    const [selectedTextId, setSelectedTextId] = useState<string[]>([]); // Track selected text
    const [isEditing, setIsEditing] = useState<boolean>(false); // Track if text is being edited
    const [canvasElements, setCanvaElements] = useAtom(canvaElementsAtom);
    const [selectedArrowIds, setSelectedArrowIds] =
        useAtom(selectedArrowIdsAtom);
    const arrowShapeRef = useRef<ArrowShapeRef | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    // Handle Mouse Down
    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (activeTool === "Arrow" && arrowShapeRef.current) {
            arrowShapeRef.current.handleMouseDown(e);
            return;
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
                points: [
                    {
                        x: pos.x,
                        y: pos.y,
                    },
                    {
                        x: pos.x + 24 * 8 + 10,
                        y: pos.y,
                    },
                    {
                        x: pos.x + 24 * 8 + 10,
                        y: pos.y + 24 + 10,
                    },
                    {
                        x: pos.x,
                        y: pos.y + 24 + 10,
                    },
                ],
            };
            setCanvaElements((elements) => [...elements, newItem]);
            setSelectedTextId([id]);
        } else if (activeTool === "Select") {
            if (arrowShapeRef.current) {
                arrowShapeRef.current.handleArrowSelect(e);
            }
            const pos = e.target?.getStage()?.getPointerPosition();
            if (!pos) return;
            const textItems = canvasElements.filter(
                (item) => item.type === "text"
            );
            const selectedItem = textItems.filter(
                (item) =>
                    pos.x >= item.x &&
                    pos.x <= item.x + item.width &&
                    pos.y >= item.y &&
                    pos.y <= item.y + item.height
            );
            setSelectedTextId(selectedItem.map((item) => item.id));
            handleInputBlur();
        } else {
            setIsEditing(false);
            setSelectedTextId([]); // Deselect text when clicking elsewhere
        }
    };
    useEffect(() => {
        if (inputRef.current && isEditing && selectedTextId) {
            const textItems = canvasElements.filter(
                (item) => item.type === "text"
            );
            const selectedItem = textItems.filter((item) =>
                selectedTextId.some((id) => id === item.id)
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
            selectedTextId.some((id) => id === item.id)
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
                    prevItems.filter(
                        (item) => !selectedTextId.some((id) => id === item.id)
                    )
                );
                setSelectedTextId([]);
            }
        }
    };

    // Handle Mouse Move for Arrows (Existing)
    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        if (activeTool === "Arrow" && arrowShapeRef.current) {
            arrowShapeRef.current.handleMouseMove(e);
        }
    };

    // Handle Mouse Up for Arrows (Existing)
    const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
        if (activeTool === "Arrow" && arrowShapeRef.current) {
            arrowShapeRef.current.handleMouseUp(e);
        }
    };

    const handleDoubleClick = (e: KonvaEventObject<MouseEvent>) => {
        canvasElements.forEach((textItem) => {
            const isInsideXBounds =
                e.evt.x >= textItem.x && e.evt.x <= textItem.x + textItem.width;
            const isInsideYBounds =
                e.evt.y >= textItem.y &&
                e.evt.y <= textItem.y + textItem.height;

            if (isInsideXBounds && isInsideYBounds) {
                setIsEditing(true);
                setSelectedTextId((ids) => [...ids, textItem.id]);
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

    // Handle drag move (updates the element's position during dragging)
    const handleDragMove = (e: KonvaEventObject<MouseEvent>) => {
        // The element being dragged
        const draggedElement = e.target;
        if (arrowShapeRef.current) {
            arrowShapeRef.current.handleElementAttachedToArrowMove(
                selectedTextId
            );
        }
        // Update arrows based on the shape's points, not the mouse position

        // Update the canvas element's points based on movement
        setCanvaElements((elements) => {
            const updatingElements = elements.filter((element) =>
                selectedTextId.includes(element.id)
            );
            const otherElements = elements.filter(
                (element) => !selectedTextId.includes(element.id)
            );

            const updatedElements = updatingElements.map((el) => {
                // Calculate the delta (how much the element moved)
                const dx = draggedElement.x() - el.x;
                const dy = draggedElement.y() - el.y;

                // Update the points by applying the delta to each point in the shape
                const updatedPoints = el.points.map((point) => ({
                    x: point.x + dx,
                    y: point.y + dy,
                }));

                return {
                    ...el,
                    points: updatedPoints, // Set the new points based on the movement
                    x: draggedElement.x(), // Update the element's position
                    y: draggedElement.y(),
                };
            });

            return [...otherElements, ...updatedElements];
        });
    };

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
                <ArrowShape ref={arrowShapeRef} />
                {/* Render text items */}
                {canvasElements
                    .filter((element) => element.type === "text")
                    .map((textItem) => (
                        <Text
                            key={textItem.id}
                            text={textItem.text}
                            x={textItem.x}
                            y={textItem.y}
                            width={textItem.width}
                            height={textItem.height}
                            fontSize={textItem.fontSize}
                            id={textItem.id}
                            draggable={activeTool === "Select"}
                            onDragMove={handleDragMove}
                        />
                    ))}
                <CustomTransformer selectedShapeIds={selectedTextId} />
            </Layer>
        </>
    );
}

export default forwardRef(MainNotesLayer);
