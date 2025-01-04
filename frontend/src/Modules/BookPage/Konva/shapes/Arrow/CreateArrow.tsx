// CreateArrow.ts
import { v4 as uuidv4 } from "uuid";
import {
    ArrowElement,
    Point,
    SpecificArrowElement,
} from "../../../../../endPointTypes/types";

type CreateArrowProps = {
    points: Point[]; // Array of points [x1, y1, x2, y2, ...]
    bookId: string;
} & Partial<Omit<SpecificArrowElement, "type" | "points">> &
    Partial<ArrowElement>;

export default function createArrow({
    points = [
        { x: 0, y: 0 },
        { x: 100, y: 100 },
    ],
    bookId,
    startId = undefined,
    endId = undefined,
    startType = undefined,
    endType = undefined,
    id = uuidv4(),
    fill = "white",
    text = undefined,
    roughness = 1,
    bowing = 0,
    seed = Math.floor(Math.random() * 100000),
    strokeWidth = 2,
    strokeStyle = "solid",
    stroke = "white",
    fillStyle = "solid",
    fillWeight = 1,
    hachureAngle = 45,
    hachureGap = 5,
    ...overrides
}: CreateArrowProps): SpecificArrowElement {
    return {
        type: "arrow",
        bookId,
        arrowElement: {
            type: "arrow",
            curveId: id,
            startId,
            endId,
            startType,
            endType,
        },
        points,
        id,
        fill,
        text,
        roughness,
        bowing,
        seed,
        strokeWidth,
        strokeStyle,
        stroke,
        fillStyle,
        fillWeight,
        hachureAngle,
        hachureGap,
        ...overrides,
    };
}
