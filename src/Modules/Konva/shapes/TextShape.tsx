import { useEffect, useRef, forwardRef } from "react";
import { Text } from "react-konva";
import {  TextShape } from "../KonvaStage";

type TextShapeProps = {
    shape: TextShape;
    isSelected: boolean;
    onSelect: (e: any) => void;
    onChange: (newAttrs: any) => void;
};

const TextItem = forwardRef<any, TextShapeProps>(
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
                <Text
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
                    text={shape.text || "Default Text"} // Provide text here
                    fontSize={shape.fontSize || 20} // Set default font size
                    fontFamily={shape.fontFamily || "Arial"}
                    fill={shape.backgroundColor || "black"} // Text fill color
                    stroke={shape.strokeColor || "transparent"} // Optional stroke around the text
                    strokeWidth={shape.strokeWidth || 0} // Optional stroke width
                    opacity={shape.opacity}
                    onClick={onSelect}
                    onTransformEnd={(e) => {
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

export default TextItem;
