import { useEffect, useRef } from "react";
import { Shape } from "../KonvaStage";
import { Rect, Transformer } from "react-konva";

type RectangleProps = {
    shape: Shape;
    isSelected: boolean;
    onSelect: () => void;
    onChange: (newAttrs: any) => void;
};

export default function Rectangle({
    shape,
    isSelected,
    onSelect,
    onChange,
}: RectangleProps) {
    const shapeRef = useRef<any>(null);
    const trRef = useRef<any>(null);

    useEffect(() => {
        if (isSelected && trRef.current) {
            // Attach transformer to the selected shape
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <>
            <Rect
                ref={shapeRef}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                fill={shape.backgroundColor} // Applying fill here
                stroke={shape.strokeColor}
                strokeWidth={shape.strokeWidth}
                draggable
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
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    flipEnabled={false}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (
                            Math.abs(newBox.width) < 5 ||
                            Math.abs(newBox.height) < 5
                        ) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>
    );
}
