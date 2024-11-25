// CreateArrow.ts
import { v4 as uuidv4 } from "uuid";
import {
    ArrowElementType
} from "../../../../../endPointTypes/types";

type CreateArrowProps = {
    points: number[]; // Array of points [x1, y1, x2, y2, ...]
} & Partial<Omit<ArrowElementType, "type" | "points">>;

export default function createArrow({
    points = [0, 0, 100, 100],
    startId = null,
    endId = null,
    startType = null,
    endType = null,
    id = uuidv4(),
    fill = "white",
    text = null,
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
}: CreateArrowProps): ArrowElementType {
    return {
        type: "arrow",
        points,
        id,
        startId,
        endId,
        startType,
        endType,
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
