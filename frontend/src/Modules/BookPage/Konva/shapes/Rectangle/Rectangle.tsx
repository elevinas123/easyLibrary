import { KonvaEventObject } from "konva/lib/Node";
import { v4 as uuidv4 } from "uuid";
import {
    CanvaElementType,
    RectElementType,
} from "../../../../../endPointTypes/types";
import {
    activeToolAtom,
    canvaElementsAtom,
    offsetPositionAtom,
    scaleAtom,
} from "../../konvaAtoms";
import { useAtom } from "jotai";
import CreateRectangle from "./createRectangle";
import { ForwardedRef, forwardRef, useImperativeHandle, useState } from "react";
import { getPos } from "../../functions/getPos";
import { Stage } from "konva/lib/Stage";
import { Shape, ShapeConfig } from "konva/lib/Shape";

type RectangleProps = {
    createElement: (element: CanvaElementType) => void;
    updateElement: (element: CanvaElementType) => void;
};
export type RectangleRef = {
    handleMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseUp: () => void;
    handleDragMove: (
        element: CanvaElementType,
        node: Shape<ShapeConfig> | Stage
    ) => Partial<CanvaElementType>;
};

function Rectangle(
    { createElement, updateElement }: RectangleProps,
    ref: ForwardedRef<RectangleRef>
) {
    const [activeTool] = useAtom(activeToolAtom);
    const [canvaElements, setCanvaElements] = useAtom(canvaElementsAtom);
    const [offsetPosition] = useAtom(offsetPositionAtom);
    const [scale] = useAtom(scaleAtom); // State to handle scale
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [currentItem, setCurrentItem] = useState<RectElementType | null>(
        null
    );
    useImperativeHandle(ref, () => ({
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleDragMove,
    }));

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
    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        const pos = getPos(offsetPosition, scale, e);
        if (!pos) return;
        if (!currentItem) return;
        console.log(canvaElements);
        const updatedRectangele = updateRectangleElement(currentItem, pos);
        updateElement(updatedRectangele);
    };
    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        const pos = getPos(offsetPosition, scale, e);
        if (!pos) return;
        if (activeTool !== "Rectangle") return;
        const id = uuidv4();
        const newRect = CreateRectangle({
            x: pos.x,
            y: pos.y,
            id,
            width: 0,
            height: 0,
        });
        console.log("newRect", newRect);
        setCurrentItem(newRect);
        createElement(newRect);
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
            points: [
                { x: node.x(), y: node.y() },
                { x: node.x() + element.width, y: node.y() },
                {
                    x: node.x() + element.width,
                    y: node.y() + element.height,
                },
                { x: node.x(), y: node.y() + element.height },
            ],
        };
        return newAttrs;
    };

    return null
}

export default forwardRef(Rectangle);
