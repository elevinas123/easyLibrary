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
            fontStyle={element.textElement.fontStyle}
            textDecoration={element.textElement.textDecoration}
            padding={5}
            align="left"
            verticalAlign="middle"
            wrap="word"
            ellipsis={true}
            draggable={draggable}
            onDragMove={handleDragMove}
            shadowColor="rgba(0,0,0,0.1)"
            shadowBlur={element.strokeWidth > 0 ? 0 : 2}
            shadowOffset={{ x: 1, y: 1 }}
            cornerRadius={2}
        />
    );
}
