import { KonvaEventObject } from "konva/lib/Node";
import RenderRectangle from "./Rectangle/RenderRectangle";
import RenderText from "./Text/RenderText";
import { CanvaElement } from "../konvaAtoms";

export const renderCanvaElement = (
    element: CanvaElement,
    draggable: boolean,
    handleDragMove: ((e: KonvaEventObject<MouseEvent>) => void) | undefined
) => {
    if (element.type === "text") {
        return (
            <RenderText
                element={element}
                draggable={draggable}
                handleDragMove={handleDragMove}
                key={element.id}
            />
        );
    } else if (element.type === "rect") {
        return (
            <RenderRectangle
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
