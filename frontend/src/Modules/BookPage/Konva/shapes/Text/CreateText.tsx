// CreateText.ts
import { v4 as uuidv4 } from "uuid";
import {
    SpecificTextElement,
    TextElementType,
} from "../../../../../endPointTypes/types";

type CreateTextProps = {
    x: number;
    y: number;
    bookId: string;
} & Partial<
    Omit<SpecificTextElement, "type" | "x" | "y" | "TextElement"> &
        Partial<TextElementType>
>;

export default function CreateText({
    x,
    y,
    bookId,
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
}: CreateTextProps): SpecificTextElement {
    return {
        type: "text",
        id: id,
        bookId,
        textElement: {
            canvaId: id,
            type: "text",
            text,
            fontFamily,
            fontSize,
        },
        strokeColor,
        strokeWidth,
        width,
        height,
        opacity,
        fill,
        x,
        y,
        outgoingArrowIds: outgoingArrowIds ?? [], // Default to an empty array
        incomingArrowIds: incomingArrowIds ?? [], // Default to an empty array
        points: points || [
            { x, y },
            { x, y: y + fontSize },
        ],
        rotation: 0,
        ...overrides,
    };
}
