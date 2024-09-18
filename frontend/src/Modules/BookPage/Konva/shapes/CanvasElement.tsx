import { useAtom } from "jotai";
import { KonvaEventObject } from "konva/lib/Node";
import {
    ForwardedRef,
    forwardRef,
    MutableRefObject,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { activeToolAtom, canvaElementsAtom } from "../konvaAtoms";
import { ArrowShapeRef } from "./ArrowShape";
import CreateRectangle, { RectElement } from "./Rectangle/createRectangle";
import { renderCanvaElement } from "./RenderShape";
import CreateText, { TextElement } from "./Text/CreateText";
import CustomTransformer from "./CustomTransformer";
// CanvaElement is now a union of all possible element types
export type CanvaElement = TextElement | RectElement;

type CanvasElementProps = {
    arrowShapeRef: MutableRefObject<ArrowShapeRef | null>;
    inputRef: MutableRefObject<HTMLInputElement | null>;
};
export type CanvaElementRef = {
    handleMouseDown(e: KonvaEventObject<MouseEvent>): void;
    handleDoubleClick(e: KonvaEventObject<MouseEvent>): void;
    handleKeyDown(e: KeyboardEvent): void;
    handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
    handleMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseUp: () => void;
};

function CanvasElement(
    { arrowShapeRef, inputRef }: CanvasElementProps,
    ref: ForwardedRef<CanvaElementRef>
) {
    const [canvaElements, setCanvaElements] = useAtom(canvaElementsAtom);
    const [selectedItemsIds, setSelectedItemsIds] = useState<string[]>([]); // Track selected text
    const [activeTool] = useAtom(activeToolAtom);
    const [isEditing, setIsEditing] = useState<boolean>(false); // Track if text is being edited
    const [currentElements, setCurrentElements] = useState<
        CanvaElement[] | null
    >(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    useEffect(() => {
        if (inputRef.current && isEditing && selectedItemsIds) {
            const textItems = canvaElements.filter(
                (item) => item.type === "text"
            );
            const selectedItem = textItems.filter((item) =>
                selectedItemsIds.some((id) => id === item.id)
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
    }, [isEditing, selectedItemsIds, canvaElements]);
    useImperativeHandle(ref, () => ({
        handleMouseDown,
        handleDoubleClick,
        handleKeyDown,
        handleInputChange,
        handleMouseMove,
        handleMouseUp,
    }));
    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        const pos = e.target?.getStage()?.getPointerPosition();
        if (!pos) return;
        if (activeTool === "Text") {
            const id = uuidv4();
            const newText = CreateText({
                x: pos.x,
                y: pos.y,
                id,
                text: "Sample Text",
                width: 24 * 8 + 10,
                height: 24 + 10,
            });
            setCanvaElements((prevItems) => {
                if (!currentElements) return prevItems;
                const oldItems = prevItems.filter((item) =>
                    currentElements?.some((el) => el.id === item.id)
                );
                return [...oldItems, ...currentElements];
            });
            setCurrentElements([newText]);
            setIsCreating(true);
            setSelectedItemsIds([id]);
        } else if (activeTool === "Arrow" && arrowShapeRef.current) {
            arrowShapeRef.current.handleMouseDown(e);
            return;
        } else if (activeTool === "Rectangle") {
            const id = uuidv4();
            const newText = CreateRectangle({
                x: pos.x,
                y: pos.y,
                id,
                width: 0,
                height: 0,
            });
            console.log("cia va", currentElements);
            setCanvaElements((prevItems) => {
                if (!currentElements) return prevItems;
                const oldItems = prevItems.filter((item) =>
                    currentElements.some((el) => el.id !== item.id)
                );
                return [...oldItems, ...currentElements];
            });
            setCurrentElements([newText]);
            setIsCreating(true);
            setSelectedItemsIds([id]);
        } else if (activeTool === "Select") {
            if (arrowShapeRef.current) {
                arrowShapeRef.current.handleArrowSelect(e);
            }
            const pos = e.target?.getStage()?.getPointerPosition();
            if (!pos) return;

            const selectedItem = canvaElements.filter(
                (item) =>
                    pos.x >= item.x &&
                    pos.x <= item.x + item.width &&
                    pos.y >= item.y &&
                    pos.y <= item.y + item.height
            );
            setCanvaElements((prevItems) => {
                if (!currentElements) return prevItems;
                const oldItems = prevItems.filter((item) =>
                    currentElements.some((el) => el.id !== item.id)
                );
                return [...oldItems, ...currentElements];
            });
            setSelectedItemsIds(selectedItem.map((item) => item.id));
            setCurrentElements(selectedItem);
            handleInputBlur();
        } else {
            setIsEditing(false);
            setSelectedItemsIds([]); // Deselect text when clicking elsewhere
        }
    };

    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        if (!currentElements || !isCreating) return;
        const pos = e.target?.getStage()?.getPointerPosition();
        if (!pos) return;

        // Update the rectangle properties
        setCurrentElements((prevElements) => {
            if (!prevElements) return null;
            return prevElements.map((element) => {
                const { x: startX, y: startY } = element;

                // Calculate the new width and height based on the mouse position
                let newWidth = Math.abs(pos.x - startX);
                let newHeight = Math.abs(pos.y - startY);
                if (pos.x <= startX) newWidth += element.width;
                if (pos.x <= startX) newHeight += element.height;
                // If the mouse moves left, adjust the x position
                const newX = pos.x < startX ? pos.x : startX;

                // If the mouse moves up, adjust the y position
                const newY = pos.y < startY ? pos.y : startY;

                return {
                    ...element,
                    x: newX, // Update x position (if moving left)
                    y: newY, // Update y position (if moving up)
                    width: newWidth,
                    height: newHeight,
                    points: [
                        { x: newX, y: newY }, // Top-left
                        { x: newX + newWidth, y: newY }, // Top-right
                        { x: newX + newWidth, y: newY + newHeight }, // Bottom-right
                        { x: newX, y: newY + newHeight }, // Bottom-left
                    ],
                };
            });
        });
    };

    const handleMouseUp = () => {
        if (!currentElements || !isCreating) return;
        setIsCreating(false);
        setCanvaElements((prevItems) => {
            const oldItems = prevItems.filter((item) =>
                currentElements.some((el) => el.id !== item.id)
            );
            return [...oldItems, ...currentElements];
        });
        setCurrentElements(null);
    };

    // Handle drag move (updates the element's position during dragging)
    const handleDragMove = (e: KonvaEventObject<MouseEvent>) => {
        const pos = e.target?.getStage()?.getPointerPosition();
        if (!pos) return;

        // The element being dragged
        const draggedElement = e.target;
        if (arrowShapeRef.current) {
            arrowShapeRef.current.handleElementAttachedToArrowMove(
                selectedItemsIds
            );
        }
        // Update arrows based on the shape's points, not the mouse position

        // Update the canvas element's points based on movement
        setCanvaElements((elements) => {
            const updatingElements = elements.filter((element) =>
                selectedItemsIds.includes(element.id)
            );
            const otherElements = elements.filter(
                (element) => !selectedItemsIds.includes(element.id)
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
    const handleDoubleClick = (e: KonvaEventObject<MouseEvent>) => {
        canvaElements.forEach((textItem) => {
            const isInsideXBounds =
                e.evt.x >= textItem.x && e.evt.x <= textItem.x + textItem.width;
            const isInsideYBounds =
                e.evt.y >= textItem.y &&
                e.evt.y <= textItem.y + textItem.height;

            if (isInsideXBounds && isInsideYBounds) {
                setIsEditing(true);
                setSelectedItemsIds((ids) => [...ids, textItem.id]);
                return;
            }
        });
    };
    const handleKeyDown = (e: KeyboardEvent) => {
        if (isEditing) return;
        if (e.key === "Delete" || e.key === "Backspace") {
            if (selectedItemsIds) {
                setCanvaElements((prevItems) =>
                    prevItems.filter(
                        (item) => !selectedItemsIds.some((id) => id === item.id)
                    )
                );
                setSelectedItemsIds([]);
            }
        }
    };
    const handleInputBlur = () => {
        if (inputRef.current) {
            inputRef.current.style.display = "none";
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedItemsIds) return;
        const updatedTextItems = canvaElements.map((item) =>
            selectedItemsIds.some((id) => id === item.id)
                ? {
                      ...item,
                      text: e.target.value,
                      width: e.target.value.length * 24 + 20,
                  }
                : item
        );
        setCanvaElements(updatedTextItems);
    };
    useEffect(() => {
        console.log("selectedItemsIds", selectedItemsIds);
        console.log("canvaElements", canvaElements);
    }, [selectedItemsIds, canvaElements]);

    return (
        <>
            {currentElements &&
                currentElements.map((element) => {
                    let id = element.id;
                    id = `placeholder:${id}`;
                    return renderCanvaElement(
                        { ...element, id },
                        activeTool === "Select",
                        handleDragMove
                    );
                })}
            {canvaElements.map((element) =>
                renderCanvaElement(
                    element,
                    activeTool === "Select",
                    handleDragMove
                )
            )}
            <CustomTransformer currentElements={currentElements} />
        </>
    );
}

export default forwardRef(CanvasElement);
