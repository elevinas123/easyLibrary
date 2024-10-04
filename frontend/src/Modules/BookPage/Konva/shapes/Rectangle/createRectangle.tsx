import { v4 as uuidv4 } from "uuid";
import { RectElementType } from "../../../../../endPointTypes/types";

type CreateRectangleProps = {
    x: number;
    y: number;
} & Partial<Omit<RectElementType, "type" | "x" | "y">>;

export default function CreateRectangle({
    x,
    y,
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
}: CreateRectangleProps): RectElementType {
    return {
        type: "rect",
        fill,
        width,
        height,
        id,
        x,
        y,
        outgoingArrowIds,
        incomingArrowIds,
        points: points || [
            { x, y },
            { x: x + width, y },
            { x: x + width, y: y + height },
            { x, y: y + height },
        ],
        strokeColor,
        strokeWidth,
        opacity,
        roughness,
        fillStyle,
        hachureGap,
        hachureAngle,
        seed,
        ...overrides, // This allows any additional properties to override the defaults
    };
}
