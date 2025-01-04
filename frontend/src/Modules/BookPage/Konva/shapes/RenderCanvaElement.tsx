import { KonvaEventObject } from "konva/lib/Node";
import RenderRectangle from "./Rectangle/RenderRectangle";
import RenderText from "./Text/RenderText";
import RenderCircle from "./Circle/RenderCircle";
import { CanvaElementSkeleton } from "../../../../endPointTypes/types";
import {
    isSpecificCircleElement,
    isSpecificRectElement,
    isSpecificTextElement,
} from "../../../../endPointTypes/typeGuards";

export const renderCanvaElement = (
    element: CanvaElementSkeleton,
    draggable: boolean,
    handleDragMove: ((e: KonvaEventObject<MouseEvent>) => void) | undefined
) => {
    if (isSpecificTextElement(element)) {
        return (
            <RenderText
                element={element}
                draggable={draggable}
                handleDragMove={handleDragMove}
                key={element.id}
            />
        );
    } else if (isSpecificRectElement(element)) {
        return (
            <RenderRectangle
                draggable={draggable}
                element={element}
                handleDragMove={handleDragMove}
                key={element.id}
            />
        );
    } else if (isSpecificCircleElement(element)) {
        return (
            <RenderCircle
                draggable={draggable}
                element={element}
                handleDragMove={handleDragMove}
                key={element.id}
            />
        );
    } else {
        return null;
    }
};
