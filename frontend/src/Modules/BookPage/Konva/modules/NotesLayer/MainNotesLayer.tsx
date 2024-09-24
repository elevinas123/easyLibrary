import { useAtom } from "jotai";
import { KonvaEventObject } from "konva/lib/Node";
import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from "react";
import { Layer } from "react-konva";
import { activeToolAtom } from "../../konvaAtoms";

import { Html } from "react-konva-utils";
import ArrowShape, { ArrowShapeRef } from "../../shapes/Arrow/ArrowShape";
import CanvasElement, { CanvaElementRef } from "../../shapes/CanvaElement";

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

    const arrowShapeRef = useRef<ArrowShapeRef | null>(null);
    const canvasElementRef = useRef<CanvaElementRef | null>(null);
    // Handle Mouse Down
    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        canvasElementRef.current?.handleMouseDown(e);
    };

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        canvasElementRef.current?.handleInputChange(e);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        canvasElementRef.current?.handleKeyDown(e);
    };

    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        if (activeTool === "Arrow" && arrowShapeRef.current) {
            arrowShapeRef.current.handleMouseMove(e);
        }
        canvasElementRef.current?.handleMouseMove(e);

    };

    const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
        if (activeTool === "Arrow" && arrowShapeRef.current) {
            arrowShapeRef.current.handleMouseUp(e);
        }
        canvasElementRef.current?.handleMouseUp();
    };

    const handleDoubleClick = (e: KonvaEventObject<MouseEvent>) => {
        canvasElementRef.current?.handleDoubleClick(e);
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
                <ArrowShape ref={arrowShapeRef} />
                {/* Render text items */}
                <CanvasElement
                    ref={canvasElementRef}
                    inputRef={inputRef}
                    arrowShapeRef={arrowShapeRef}
                />
            </Layer>
        </>
    );
}

export default forwardRef(MainNotesLayer);
