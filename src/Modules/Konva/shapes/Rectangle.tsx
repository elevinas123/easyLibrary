import { Rect } from "react-konva";
import { Shape } from "../KonvaStage";

type RectangleProps = {
    shape: Shape;
    handleShapeClick: (shape: Shape, ref: any) => void;
    handleDragEnd: (e: any) => void;

};
export default function Rectangle({ shape, handleShapeClick, handleDragEnd }: RectangleProps) {
    return (
        <Rect
            key={shape.id}
            id={shape.id}
            ref={(node: any) => handleShapeClick(shape, node)}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            fill={shape.backgroundColor}
            stroke={shape.strokeColor}
            strokeWidth={shape.strokeWidth}
            opacity={shape.opacity}
            dash={shape.strokeStyle.value}
            draggable
            onDragEnd={handleDragEnd}
        />
    );
}
