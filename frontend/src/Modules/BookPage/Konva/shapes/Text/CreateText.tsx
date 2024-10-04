// CreateText.ts
import { v4 as uuidv4 } from "uuid";
import { TextElementType } from "../../../../../endPointTypes/types";

type CreateTextProps = {
    x: number;
    y: number;
} & Partial<Omit<TextElementType, "type" | "x" | "y">>;

export default function CreateText({
    x,
    y,
    text = "Sample Text",
    fontFamily = "Arial",
    fontSize = 14,
    fill = "black",
    id = uuidv4(),
    outgoingArrowIds = [],
    incomingArrowIds = [],
    strokeColor = "black",
    strokeWidth = 1,
    width = 24 * 8 + 10,
    height = 24 + 10,
    opacity = 1,
    points,
    ...overrides
}: CreateTextProps): TextElementType {
    return {
        type: "text",
        text,
        fontFamily,
        strokeColor,
        strokeWidth,
        fontSize,
        width,
        height,
        opacity,
        fill,
        id,
        x,
        y,
        outgoingArrowIds,
        incomingArrowIds,
        points: points || [
            { x, y },
            { x, y: y + fontSize },
        ],
        ...overrides,
    };
}
