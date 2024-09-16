import { Rect } from "react-konva";
import { RectElement } from "./createRectangle";
import { KonvaEventObject } from "konva/lib/Node";

type RenderRectangleProps = {
    draggable: boolean;
    element: RectElement;
    handleDragMove: (e: KonvaEventObject<MouseEvent>) => void
};

export default function RenderRectangle({
    draggable,
    element,
    handleDragMove
}: RenderRectangleProps) {
    return (
        <Rect
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            fill={element.fill}
            stroke={element.strokeColor}
            strokeWidth={element.strokeWidth}
            opacity={element.opacity}
            draggable={draggable}
            onDragMove={handleDragMove}
            
        />
    );
}
