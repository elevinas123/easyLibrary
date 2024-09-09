import { useEffect, useRef, forwardRef } from "react";
import { Shape } from "../KonvaStage";
import { Rect } from "react-konva";

type RectangleProps = {
    shape: Shape;
    isSelected: boolean;
    onSelect: (e: any) => void;
    onChange: (newAttrs: any) => void;
};

const Rectangle = forwardRef<any, RectangleProps>(
    ({ shape, isSelected, onSelect, onChange }, ref) => {
        const shapeRef = useRef<any>(null);

        useEffect(() => {
            if (isSelected && shapeRef.current) {
                shapeRef.current.draggable(true); // Make the shape draggable when selected
            } else if (shapeRef.current) {
                shapeRef.current.draggable(false); // Disable dragging when not selected
            }
        }, [isSelected]);

        return (
            <>
                <Rect
                    ref={(node) => {
                        shapeRef.current = node;
                        if (typeof ref === "function") {
                            ref(node); // If the ref is a function, call it
                        } else if (ref) {
                            ref.current = node; // Otherwise, assign it
                        }
                    }}
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    fill={shape.backgroundColor} // Applying fill here
                    stroke={shape.strokeColor}
                    strokeWidth={shape.strokeWidth}
                    opacity={shape.opacity}
                    onClick={onSelect}
                    onTransformEnd={() => {
                        const node = shapeRef.current;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();

                        node.scaleX(1);
                        node.scaleY(1);

                        onChange({
                            ...shape,
                            x: node.x(),
                            y: node.y(),
                            width: Math.max(5, node.width() * scaleX),
                            height: Math.max(5, node.height() * scaleY),
                        });
                    }}
                    onDragEnd={() => {
                        const node = shapeRef.current;
                        onChange({
                            ...shape,
                            x: node.x(),
                            y: node.y(),
                        });
                    }}
                />
            </>
        );
    }
);

export default Rectangle;
