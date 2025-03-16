// CreateText.ts
import { v4 as uuidv4 } from "uuid";
import {
    SpecificTextElement,
    TextElementType,
} from "../../../../../endPointTypes/types";
import { measureTextWidth } from "../../functions/measureTextWidth";

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
    text = "New text",
    fontFamily = "Arial",
    fontSize = 16,
    fill = "#333333",
    id = uuidv4(),
    outgoingArrowIds = [],
    incomingArrowIds = [],
    strokeColor = "transparent",
    strokeWidth = 0,
    width,
    height,
    opacity = 1,
    points,
    ...overrides
}: CreateTextProps): SpecificTextElement {
    // Calculate width and height based on text content if not provided
    const calculatedWidth = width ?? measureTextWidth(text, fontSize, fontFamily) + 20; // Add padding
    const calculatedHeight = height ?? fontSize * 1.5; // Reasonable height based on font size
    
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
        width: calculatedWidth,
        height: calculatedHeight,
        opacity,
        fill,
        x,
        y,
        outgoingArrowIds: outgoingArrowIds ?? [], // Default to an empty array
        incomingArrowIds: incomingArrowIds ?? [], // Default to an empty array
        points: points || [
            { x, y },
            { x: x + calculatedWidth, y },
            { x: x + calculatedWidth, y: y + calculatedHeight },
            { x, y: y + calculatedHeight },
        ],
        rotation: 0,
        ...overrides,
    };
}
