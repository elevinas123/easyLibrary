import { useAtom } from "jotai";
import Konva from "konva";
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
import { getPos } from "../functions/getPos";
import {
    activeToolAtom,
    arrowsAtom,
    CanvaElement,
    canvaElementsAtom,
    offsetPositionAtom,
    scaleAtom,
    selectedItemsIdsAtom,
} from "../konvaAtoms";
import { ArrowShapeRef } from "./Arrow/ArrowShape";
<<<<<<< HEAD
import { renderCanvaElement } from "./RenderCanvaElement";
import CustomTransformer from "./CustomTransformer";
import Konva from "konva";
import { getPos } from "../functions/getPos";
import { RectElement, TextElement } from "../../../../endPointTypes/types";
import CreateText from "./Text/CreateText";
import CreateRectangle from "./Rectangle/createRectangle";
=======
import CustomTransformer from "./CustomTransformer";
import CreateRectangle from "./Rectangle/createRectangle";
import { renderCanvaElement } from "./RenderCanvaElement";
import {
    CanvaElementType,
    RectElementType,
    TextElementType,
} from "../../../../endPointTypes/types";
import CreateText from "./Text/CreateText";
>>>>>>> MongooseBackend

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
    const [selectedItemsIds, setSelectedItemsIds] =
        useAtom(selectedItemsIdsAtom);
    const [arrows] = useAtom(arrowsAtom);

    const [activeTool] = useAtom(activeToolAtom);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [offsetPosition] = useAtom(offsetPositionAtom);
    const [scale] = useAtom(scaleAtom); // State to handle scale

    useImperativeHandle(ref, () => ({
        handleMouseDown,
        handleDoubleClick,
        handleKeyDown,
        handleInputChange,
        handleMouseMove,
        handleMouseUp,
    }));

    useEffect(() => {
        if (inputRef.current && isEditing && selectedItemsIds.length > 0) {
            const textItem = canvaElements.find(
                (item) =>
                    item.type === "text" && item.id === selectedItemsIds[0]
            ) as TextElementType | undefined;

            if (textItem) {
                const input = inputRef.current;
                input.style.left = `${textItem.x}px`;
                input.style.top = `${textItem.y}px`;
                input.style.fontSize = `${textItem.fontSize}px`;
                input.style.display = "block";
                input.value = textItem.text;
                input.style.width = `${textItem.width}px`;
                input.focus();
                return;
            }
        }
        handleInputBlur();
    }, [isEditing, selectedItemsIds, canvaElements]);

    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        const transformer = stage?.findOne<Konva.Transformer>("Transformer");
        if (transformer) {
            const clickedOnTransformer =
                (e.target as unknown as Konva.Transformer) === transformer ||
                transformer?.children?.includes(e.target);
            if (clickedOnTransformer) {
                // Do not deselect if clicking on the transformer
                return;
            }
        }
        // Check if the click is on the transformer or its children
        const pos = getPos(offsetPosition, scale, e);
        if (!pos) return;
        switch (activeTool) {
            case "Text":
                handleTextToolMouseDown(pos);
                break;
            case "Arrow":
                if (arrowShapeRef.current) {
                    arrowShapeRef.current.handleMouseDown(e);
                }
                break;
            case "Rectangle":
                handleRectangleToolMouseDown(pos);
                break;
            case "Select":
                handleSelectToolMouseDown(e);
                break;
            default:
                setIsEditing(false);
                setSelectedItemsIds([]);
                break;
        }
    };

    const handleTextToolMouseDown = (pos: { x: number; y: number }) => {
        const id = uuidv4();
        const newText = CreateText({
            x: pos.x,
            y: pos.y,
            id,
            text: "Sample Text",
            width: 24 * 8 + 10,
            height: 24 + 10,
        });
        setCanvaElements((prevItems) => [...prevItems, newText]);
        setSelectedItemsIds([id]);
        setIsCreating(true);
    };

    const handleRectangleToolMouseDown = (pos: { x: number; y: number }) => {
        const id = uuidv4();
        const newRect = CreateRectangle({
            x: pos.x,
            y: pos.y,
            id,
            width: 0,
            height: 0,
        });
        setCanvaElements((prevItems) => [...prevItems, newRect]);
        setSelectedItemsIds([id]);
        setIsCreating(true);
    };

    const handleSelectToolMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (arrowShapeRef.current) {
            arrowShapeRef.current.handleArrowSelect(e);
        }
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;

        const selectedItems = getItemsAtPosition(pos);
        setSelectedItemsIds(selectedItems.map((item) => item.id));

        setIsEditing(false);
        handleInputBlur();
    };

    const getItemsAtPosition = (pos: { x: number; y: number }) => {
        const items = [
            ...canvaElements.filter(
                (item) =>
                    pos.x >= item.x &&
                    pos.x <= item.x + item.width &&
                    pos.y >= item.y &&
                    pos.y <= item.y + item.height
            ),
            ...arrows.filter((item) => {
                const [x1, y1, x2, y2] = item.points;

                // Calculate the minimum and maximum x and y values
                const minX = Math.min(x1, x2);
                const maxX = Math.max(x1, x2);
                const minY = Math.min(y1, y2);
                const maxY = Math.max(y1, y2);

                // Check if the position falls within the bounding box
                return (
                    pos.x >= minX &&
                    pos.x <= maxX &&
                    pos.y >= minY &&
                    pos.y <= maxY
                );
            }),
        ];
        console.log("getting items", items);
        return items;
    };

    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        if (!isCreating) return;
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;

        setCanvaElements((prevElements) => {
            if (prevElements.length === 0) return prevElements;
            const updatedElements = [...prevElements];
            const lastElement = updatedElements[updatedElements.length - 1];
            if (lastElement.id === selectedItemsIds[0]) {
                if (lastElement.type === "rect") {
                    const updatedElement = updateRectangleElement(
                        lastElement as RectElementType,
                        pos
                    );
                    updatedElements[updatedElements.length - 1] =
                        updatedElement;
                }
                // Add cases for other types if needed
            }
            return updatedElements;
        });
    };

    const updateRectangleElement = (
        element: RectElementType,
        pos: { x: number; y: number }
    ): RectElementType => {
        const { x: startX, y: startY } = element;
        const newWidth = Math.abs(pos.x - startX);
        const newHeight = Math.abs(pos.y - startY);
        const newX = pos.x < startX ? pos.x : startX;
        const newY = pos.y < startY ? pos.y : startY;
        console.log(
            "newX, newY, newWidth, newHeight",
            newX,
            newY,
            newWidth,
            newHeight
        );
        return {
            ...element,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
            points: [
                { x: newX, y: newY },
                { x: newX + newWidth, y: newY },
                { x: newX + newWidth, y: newY + newHeight },
                { x: newX, y: newY + newHeight },
            ],
        };
    };

    const handleMouseUp = () => {
        if (isCreating) {
            setIsCreating(false);
        }
    };

    const handleDragMove = (e: KonvaEventObject<MouseEvent>) => {
        const node = e.target;
        const id = node.id();

        if (arrowShapeRef.current) {
            arrowShapeRef.current.handleElementAttachedToArrowMove(
                selectedItemsIds
            );
        }

        const newAttrs = {
            x: node.x(),
            y: node.y(),
            points: [
                { x: node.x(), y: node.y() },
                { x: node.x() + node.width(), y: node.y() },
                { x: node.x() + node.width(), y: node.y() + node.height() },
                { x: node.x(), y: node.y() + node.height() },
            ],
        };
        console.log("id, newAttrs", id, newAttrs);

        updateElementInState(id, newAttrs);
    };

    const handleDoubleClick = (e: KonvaEventObject<MouseEvent>) => {
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;

        const clickedItem = getItemsAtPosition(pos).find(
            (item) => item.type === "text"
        );

        if (clickedItem) {
            setIsEditing(true);
            setSelectedItemsIds([clickedItem.id]);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (isEditing) return;
        if (e.key === "Delete" || e.key === "Backspace") {
            if (selectedItemsIds.length > 0) {
                setCanvaElements((prevItems) =>
                    prevItems.filter(
                        (item) => !selectedItemsIds.includes(item.id)
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
        if (selectedItemsIds.length === 0) return;
        const newText = e.target.value;
        const newWidth = newText.length * 24 + 20;
        updateElementInState(selectedItemsIds[0], {
            text: newText,
            width: newWidth,
        });
    };

    const updateElementInState = (
        id: string,
        newAttrs: Partial<CanvaElementType>
    ) => {
        setCanvaElements((elements) =>
            elements.map((el) => {
                if (el.id === id) {
                    return {
                        ...el,
                        ...newAttrs,
                        type: el.type, // Ensure the type remains the same
                    } as CanvaElementType;
                }
                return el;
            })
        );
    };

    return (
        <>
            {canvaElements.map((element) =>
                renderCanvaElement(
                    element,
                    activeTool === "Select",
                    handleDragMove
                )
            )}
            <CustomTransformer
                selectedIds={selectedItemsIds}
                updateElementInState={updateElementInState}
            />
        </>
    );
}

export default forwardRef(CanvasElement);
