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

type CircleProps = {
    createElement: (element: CanvaElementType) => void;
    updateElement: (element: CanvaElementType) => void;
};

export type CircleRef = {
    handleMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseUp: () => void;
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
        };
    };

    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        const pos = getPos(offsetPosition, scale, e);
        if (!pos) return;
        if (!currentItem) return;
        const updatedCircle = updateCircleElement(currentItem, pos);
        updateElement(updatedCircle);
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
        setCurrentItem(newCircle);
        createElement(newCircle);
    };

    const handleMouseUp = () => {
        setCurrentItem(null);
    };

    return null;
}

export default forwardRef(Circle);
