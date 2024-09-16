import { Rect } from "react-konva";
import { RectElement } from "./createRectangle";

type RenderRectangleProps = {
    draggable: boolean;
    element: RectElement;
};

export default function RenderRectangle({
    draggable,
    element,
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
            
        />
    );
}
