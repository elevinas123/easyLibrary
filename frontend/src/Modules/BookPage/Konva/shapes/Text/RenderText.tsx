import { KonvaEventObject } from "konva/lib/Node";
import { Text } from "react-konva";
import {
    SpecificTextElement
} from "../../../../../endPointTypes/types";

export type RenderTextProps = {
    draggable: boolean;
    element: SpecificTextElement;
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
            text={element.textElement.text}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            fill={element.fill}
            stroke={element.strokeColor}
            strokeWidth={element.strokeWidth}
            opacity={element.opacity}
            fontSize={element.textElement.fontSize}
            fontFamily={element.textElement.fontFamily}
            draggable={draggable}
            onDragMove={handleDragMove}
        />
    );
}
