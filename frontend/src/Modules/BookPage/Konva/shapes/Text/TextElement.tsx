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
import { ForwardedRef, forwardRef, useImperativeHandle, useState } from "react";
import { getPos } from "../../functions/getPos";
import { Stage } from "konva/lib/Stage";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import CreateText from "./CreateText";

type TextElementProps = {
    createElement: (element: CanvaElementType) => void;
    updateElement: (element: CanvaElementType) => void;
};
export type TextElementRef = {
    handleMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseUp: () => void;
    handleDragMove: (
        element: CanvaElementType,
        node: Shape<ShapeConfig> | Stage
    ) => Partial<CanvaElementType>;
};

function TextElement(
    { createElement, updateElement }: TextElementProps,
    ref: ForwardedRef<TextElementRef>
) {
    const [activeTool] = useAtom(activeToolAtom);
    const [canvaElements, setCanvaElements] = useAtom(canvaElementsAtom);
    const [offsetPosition] = useAtom(offsetPositionAtom);
    const [scale] = useAtom(scaleAtom); // State to handle scale
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [currentItem, setCurrentItem] = useState<TextElementType | null>(
        null
    );
    useImperativeHandle(ref, () => ({
        handleMouseDown,
        handleMouseUp,
        handleDragMove,
    }));

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

    return null;
}

export default forwardRef(TextElement);
