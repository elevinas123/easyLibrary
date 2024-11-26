import { KonvaEventObject } from "konva/lib/Node";
import { v4 as uuidv4 } from "uuid";
import {
    CanvaElementType,
    RectElementType,
    TextElementType,
} from "../../../../../endPointTypes/types";
import {
    activeToolAtom,
    canvaElementsAtom,
    offsetPositionAtom,
    scaleAtom,
} from "../../konvaAtoms";
import { useAtom } from "jotai";
import {
    ForwardedRef,
    forwardRef,
    MutableRefObject,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import { getPos } from "../../functions/getPos";
import { Stage } from "konva/lib/Stage";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import CreateText from "./CreateText";
import { measureTextWidth } from "../../functions/measureTextWidth";

type TextElementProps = {
    createElement: (element: CanvaElementType) => void;
    updateElement: (element: CanvaElementType) => void;
    deleteElement: (id: string) => void;
    inputRef: MutableRefObject<HTMLInputElement | null>;
};
export type TextElementRef = {
    handleMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseUp: () => void;
    handleDragMove: (
        element: CanvaElementType,
        node: Shape<ShapeConfig> | Stage
    ) => Partial<CanvaElementType>;
    handleDoubleClick: (e: KonvaEventObject<MouseEvent>) => void;
    handleKeyDown: (e: KeyboardEvent) => void;
    handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
};

function TextElement(
    { createElement, updateElement, deleteElement, inputRef }: TextElementProps,
    ref: ForwardedRef<TextElementRef>
) {
    const [activeTool] = useAtom(activeToolAtom);
    const [canvaElements] = useAtom(canvaElementsAtom);
    const [offsetPosition] = useAtom(offsetPositionAtom);
    const [scale] = useAtom(scaleAtom); // State to handle scale
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentItem, setCurrentItem] = useState<TextElementType | null>(
        null
    );
    useImperativeHandle(ref, () => ({
        handleMouseDown,
        handleMouseUp,
        handleDragMove,
        handleDoubleClick,
        handleKeyDown,
        handleInputChange,
    }));
    useEffect(() => {
        if (inputRef.current && isEditing && currentItem) {
            const input = inputRef.current;
            input.style.left = `${currentItem.x}px`;
            input.style.top = `${currentItem.y}px`;
            input.style.fontSize = `${currentItem.fontSize}px`;
            input.style.display = "block";
            input.value = currentItem.text;
            input.style.width = `${currentItem.width}px`;
            input.focus();
            return;
        }
        handleInputBlur();
    }, [isEditing, currentItem]);
    const handleInputBlur = () => {
        if (inputRef.current) {
            inputRef.current.style.display = "none";
        }
    };
    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        const pos = getPos(offsetPosition, scale, e);
        if (!pos) return;
        if (activeTool !== "Text") return;
        const id = uuidv4();
        const newText = CreateText({
            x: pos.x,
            y: pos.y,
            id,
            text: "Sample Text",
            width: 24 * 8 + 10,
            height: 24 + 10,
        });
        console.log("newText", newText);
        setCurrentItem(newText);
        createElement(newText);
    };
    const handleMouseUp = () => {
        setCurrentItem(null);
    };
    const handleDragMove = (
        element: CanvaElementType,
        node: Shape<ShapeConfig> | Stage
    ): Partial<CanvaElementType> => {
        const newAttrs = {
            x: node.x(),
            y: node.y(),
        };
        return newAttrs;
    };
    const getItemsAtPosition = (pos: { x: number; y: number }) => {
        console.log("canvaElemenets", canvaElements);
        const items = [
            ...canvaElements.filter((item) => {
                return (
                    pos.x >= item.x &&
                    pos.x <= item.x + item.width &&
                    pos.y >= item.y &&
                    pos.y <= item.y + item.height
                );
            }),
        ];
        console.log("getting items", items);
        return items;
    };
    const handleDoubleClick = (e: KonvaEventObject<MouseEvent>) => {
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;

        const clickedItem = getItemsAtPosition(pos).find(
            (item) => item.type === "text"
        );

        if (clickedItem) {
            setIsEditing(true);
            setCurrentItem(clickedItem);
        }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
        if (isEditing) return;
        if (!currentItem) return;
        if (e.key === "Delete" || e.key === "Backspace") {
            deleteElement(currentItem?.id);
        }
    };
    const updateTextElement = (text: string) => {
        if (!currentItem) return;
        const newWidth = measureTextWidth(text, currentItem.fontSize + 1);
        setCurrentItem((oldItem) => {
            if (!oldItem) return null;
            return {
                ...oldItem,
                text,
                width: newWidth,
            };
        });
        updateElement({
            ...currentItem,
            text,
            width: newWidth,
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!currentItem) return;
        if (!isEditing) return;
        const newText = e.target.value;
        updateTextElement(newText);
    };

    return null;
}

export default forwardRef(TextElement);
