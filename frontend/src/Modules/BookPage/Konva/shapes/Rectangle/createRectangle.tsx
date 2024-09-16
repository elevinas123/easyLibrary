import { CanvaElementSkeleton } from "../../KonvaStage";
import { v4 as uuidv4 } from "uuid";

export interface RectElement extends CanvaElementSkeleton {
    type: "rect";
}

type CreateRectangleProps = {
    x: number;
    y: number;
} & Partial<Omit<RectElement, 'type' | 'x' | 'y'>>;

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
    ...overrides
}: CreateRectangleProps): RectElement {
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
        ...overrides, // This allows any additional properties to override the defaults
    };
}
