import {
    CanvaElementSkeleton,
    SpecificCircleElement,
    SpecificRectElement,
    SpecificTextElement,
} from "./types";

export function isSpecificTextElement(
    item: CanvaElementSkeleton
): item is SpecificTextElement {
    return item.type === "text" && !!item.textElement;
}

export function isSpecificRectElement(
    item: CanvaElementSkeleton
): item is SpecificRectElement {
    return item.type === "rect" && !!item.rectElement;
}

export function isSpecificCircleElement(
    item: CanvaElementSkeleton
): item is SpecificCircleElement {
    return item.type === "circle" && !!item.circleElement;
}
