import { useEffect, useRef, forwardRef } from "react";
import { Circle } from "react-konva";
import { CircleShape } from "./KonvaStage";

type CircleProps = {
    shape: CircleShape;
    isSelected: boolean;
    onSelect: (e: any) => void;
    onChange: (newAttrs: any) => void;
};

const CircleItem = forwardRef<any, CircleProps>(
    ({ shape, isSelected, onSelect, onChange }, ref) => {
        const shapeRef = useRef<any>(null);

        useEffect(() => {
            if (isSelected && shapeRef.current) {
                shapeRef.current.draggable(true); // Make the circle draggable when selected
            } else if (shapeRef.current) {
                shapeRef.current.draggable(false); // Disable dragging when not selected
            }
        }, [isSelected]);

        return (
            <>
                <Circle
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
                    radius={shape.radius} // Ensure TypeScript knows this is a CircleShape
                    fill={shape.fill} // Circle-specific fill color
                    stroke={shape.strokeColor}
                    strokeWidth={shape.strokeWidth}
                    opacity={shape.opacity}
                    onClick={onSelect}
                    onTransformEnd={(e) => {
                        const node = shapeRef.current;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();

                        node.scaleX(1);
                        node.scaleY(1);

                        // Update radius based on scaling
                        onChange({
                            ...shape,
                            x: node.x(),
                            y: node.y(),
                            radius: Math.max(
                                5,
                                (shape as CircleShape).radius * scaleX
                            ),
                        });
                    }}
                    onDragEnd={(e) => {
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

export default CircleItem;
