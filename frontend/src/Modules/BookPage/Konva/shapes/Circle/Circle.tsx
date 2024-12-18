// src/components/CanvasElements/Circle/Circle.tsx

import { KonvaEventObject } from "konva/lib/Node";
import { v4 as uuidv4 } from "uuid";
import {
    CanvaElementType,
    CircleElementType,
} from "../../../../../endPointTypes/types";
import {
    activeToolAtom,
    canvaElementsAtom,
    offsetPositionAtom,
    scaleAtom,
} from "../../konvaAtoms";
import { useAtom } from "jotai";
import CreateCircle from "./createCircle";
import { ForwardedRef, forwardRef, useImperativeHandle, useState } from "react";
import { getPos } from "../../functions/getPos";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Stage } from "konva/lib/Stage";

type CircleProps = {
    createElement: (element: CanvaElementType) => void;
    updateElement: (element: CanvaElementType) => void;
};

export type CircleRef = {
    handleMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseUp: () => void;
    handleDragMove: (
        element: CanvaElementType,
        node: Shape<ShapeConfig> | Stage
    ) => Partial<CanvaElementType>;
};

function Circle(
    { createElement, updateElement }: CircleProps,
    ref: ForwardedRef<CircleRef>
) {
    const [activeTool] = useAtom(activeToolAtom);
    const [canvaElements, setCanvaElements] = useAtom(canvaElementsAtom);
    const [offsetPosition] = useAtom(offsetPositionAtom);
    const [scale] = useAtom(scaleAtom);
    const [currentItem, setCurrentItem] = useState<CircleElementType | null>(
        null
    );

    useImperativeHandle(ref, () => ({
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleDragMove,
    }));

    const updateCircleElement = (
        element: CircleElementType,
        pos: { x: number; y: number }
    ): CircleElementType => {
        const { x: centerX, y: centerY } = element;
        const radius = Math.hypot(pos.x - centerX, pos.y - centerY);
        return {
            ...element,
            radius,
            height: radius * 2,
            width: radius * 2,
        };
    };

    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        const pos = getPos(offsetPosition, scale, e);
        if (!pos) return;
        if (!currentItem) return;
        const updatedCircle = updateCircleElement(currentItem, pos);
        updateElement(updatedCircle);
        console.log(updatedCircle);
    };

    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        const pos = getPos(offsetPosition, scale, e);
        if (!pos) return;
        if (activeTool !== "Circle") return;
        const id = uuidv4();
        const newCircle = CreateCircle({
            x: pos.x,
            y: pos.y,
            id,
            radius: 0,
        });
        console.log("newCircle", newCircle);
        setCurrentItem(newCircle);
        createElement(newCircle);
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

export default forwardRef(Circle);
