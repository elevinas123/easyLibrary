import { Text } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { TextElement } from "../../../../../endPointTypes/types";

export type RenderTextProps = {
    draggable: boolean;
    element: TextElement;
    handleDragMove: ((e: KonvaEventObject<MouseEvent>) => void) | undefined;
};
export default function RenderText({
    element,
    draggable,
    handleDragMove,
}: RenderTextProps) {
    return (
        <Text
            id={element.id}
            text={element.text}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            fill={element.fill}
            stroke={element.strokeColor}
            strokeWidth={element.strokeWidth}
            opacity={element.opacity}
            fontSize={element.fontSize}
            fontFamily={element.fontFamily}
            draggable={draggable}
            onDragMove={handleDragMove}
        />
    );
}
