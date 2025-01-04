import { CanvaElementSkeleton, SpecificTextElement } from "./types";

export function isSpecificTextElement(
    item: CanvaElementSkeleton
): item is SpecificTextElement {
    return item.type === "text" && !!item.textElement;
}
