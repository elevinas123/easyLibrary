import { useEffect, useRef, forwardRef, useState } from "react";
import { Text } from "react-konva";
import { TextShape } from "../KonvaStage";

type TextShapeProps = {
    shape: TextShape;
    isSelected: boolean;
    onSelect: (e: any) => void;
    onChange: (newAttrs: any) => void;
};

const TextItem = forwardRef<any, TextShapeProps>(
    ({ shape, isSelected, onSelect, onChange }, ref) => {
        const shapeRef = useRef<any>(null);
        const [initialFontSize, setInitialFontSize] = useState(shape.fontSize); // Store original fontSize
        const [initialDimensions, setInitialDimensions] = useState({
            width: shape.width,
            height: shape.height,
        });

        useEffect(() => {
            if (isSelected && shapeRef.current) {
                shapeRef.current.draggable(true); // Make the shape draggable when selected
            } else if (shapeRef.current) {
                shapeRef.current.draggable(false); // Disable dragging when not selected
            }
        }, [isSelected]);

        useEffect(() => {
            // Set initial dimensions for scaling calculation
            setInitialFontSize(shape.fontSize);
            setInitialDimensions({ width: shape.width, height: shape.height });
        }, [shape]);

        const handleTransformEnd = () => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            // Reset the scaling so it does not accumulate
            node.scaleX(1);
            node.scaleY(1);

            // Calculate the new width and height after scaling
            const newWidth = node.width() * scaleX;
            const newHeight = node.height() * scaleY;

            // Calculate the proportional font size based on width scaling
            const scaleFactor = newWidth / initialDimensions.width;

            const newFontSize = Math.max(5, initialFontSize * scaleFactor);

            onChange({
                ...shape,
                x: node.x(),
                y: node.y(),
                fontSize: newFontSize,
                width: newWidth,
                height: newHeight,
            });
        };

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
                    fi5ll={shape.backgroundColor || "black"} // Text fill color
                    stroke={shape.strokeColor || "transparent"} // Optional stroke around the text
                    strokeWidth={shape.strokeWidth || 0} // Optional stroke width
                    opacity={shape.opacity}
                    onClick={onSelect}
                    onTransformEnd={handleTransformEnd} // Call our new handler
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

export default TextItem;
