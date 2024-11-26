// src/components/CanvasElements/Circle/createCircle.ts

import { v4 as uuidv4 } from "uuid";

import { CircleElementType } from "../../../../../endPointTypes/types";

type CreateCircleProps = {
    x: number;
    y: number;
} & Partial<Omit<CircleElementType, "type" | "x" | "y">>;

export default function CreateCircle({
    x,
    y,
    fill = "blue",
    radius = 10,
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
}: CreateCircleProps): CircleElementType {
    return {
        type: "circle",
        fill,
        radius,
        width: radius * 2,
        height: radius * 2,
        id,
        x,
        y,
        outgoingArrowIds,
        incomingArrowIds,
        points: points || [{ x, y }],
        strokeColor,
        strokeWidth,
        opacity,
        roughness,
        fillStyle,
        hachureGap,
        hachureAngle,
        seed,
        ...overrides,
    };
}
