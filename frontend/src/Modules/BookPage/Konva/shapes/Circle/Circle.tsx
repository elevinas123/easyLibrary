// src/components/CanvasElements/Circle/Circle.tsx

import { KonvaEventObject } from "konva/lib/Node";
import { v4 as uuidv4 } from "uuid";

import { useAtom } from "jotai";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Stage } from "konva/lib/Stage";
import { ForwardedRef, forwardRef, useImperativeHandle, useState } from "react";
import {
    CanvaElementSkeleton,
    SpecificCircleElement,
} from "../../../../../endPointTypes/types";
import { getPos } from "../../functions/getPos";
import {
    activeToolAtom,
    bookIdAtom,
    canvaElementsAtom,
    offsetPositionAtom,
    scaleAtom,
} from "../../konvaAtoms";
import CreateCircle from "./createCircle";

type CircleProps = {
    createElement: (element: CanvaElementSkeleton) => void;
    updateElement: (element: CanvaElementSkeleton) => void;
};

export type CircleRef = {
    handleMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseUp: () => void;
    handleDragMove: (
        element: SpecificCircleElement,
        node: Shape<ShapeConfig> | Stage
    ) => Partial<CanvaElementSkeleton>;
};

function Circle(
    { createElement, updateElement }: CircleProps,
    ref: ForwardedRef<CircleRef>
) {
    const [activeTool] = useAtom(activeToolAtom);
    const [canvaElements, setCanvaElements] = useAtom(canvaElementsAtom);
    const [offsetPosition] = useAtom(offsetPositionAtom);
    const [scale] = useAtom(scaleAtom);
    const [currentItem, setCurrentItem] =
        useState<SpecificCircleElement | null>(null);
    const [bookId] = useAtom(bookIdAtom);
    useImperativeHandle(ref, () => ({
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleDragMove,
    }));

    const updateCircleElement = (
        element: SpecificCircleElement,
        pos: { x: number; y: number }
    ): SpecificCircleElement => {
        const { x: centerX, y: centerY } = element;
        const radius = Math.hypot(pos.x - centerX, pos.y - centerY);
        return {
            ...element,
            circleElement: {
                ...element.circleElement,
                radius,
            },
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
        if (!bookId) return;
        if (activeTool !== "Circle") return;
        const id = uuidv4();
        const newCircle = CreateCircle({
            x: pos.x,
            y: pos.y,
            bookId: bookId,
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
        element: SpecificCircleElement,
        node: Shape<ShapeConfig> | Stage
    ): Partial<SpecificCircleElement> => {
        const newAttrs = {
            x: node.x(),
            y: node.y(),
        };
        return newAttrs;
    };

    return null;
}

export default forwardRef(Circle);
