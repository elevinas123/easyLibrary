import { v4 as uuidv4 } from "uuid";
import {
    RectElement,
    SpecificRectElement
} from "../../../../../endPointTypes/types";

type CreateRectangleProps = {
    x: number;
    y: number;
    bookId: string;
} & Partial<Omit<SpecificRectElement, "type" | "x" | "y">> &
    Partial<RectElement>;

export default function CreateRectangle({
    x,
    y,
    bookId,
    fill = "green",
    width = 10,
    height = 10,
    id = uuidv4(),
    outgoingArrowIds = [],
    incomingArrowIds = [],
    strokeColor = "black",
    strokeWidth = 1,
    opacity = 1,
    points,
    roughness = 1,
    fillStyle = "hachure",
    hachureGap = 5,
    hachureAngle = 60,
    seed = Math.floor(Math.random() * 1000000),
    ...overrides
}: CreateRectangleProps): SpecificRectElement {
    return {
        type: "rect",
        bookId,
        fill,
        width,
        height,
        id,
        x,
        y,
        outgoingArrowIds,
        incomingArrowIds,
        opacity,
        rectElement: {
            canvaId: id,
            type: "rect",
            roughness,
            hachureGap,
            hachureAngle,

            fillStyle,
            seed,
        },
        points: points || [
            { x, y },
            { x: x + width, y },
            { x: x + width, y: y + height },
            { x, y: y + height },
        ],
        strokeColor,
        strokeWidth,
        rotation: 0,
        ...overrides, // This allows any additional properties to override the defaults
    };
}
