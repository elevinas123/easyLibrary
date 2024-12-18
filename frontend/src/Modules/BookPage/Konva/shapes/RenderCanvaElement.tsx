import { KonvaEventObject } from "konva/lib/Node";
import { CanvaElementType } from "../../../../endPointTypes/types";
import RenderRectangle from "./Rectangle/RenderRectangle";
import RenderText from "./Text/RenderText";
import RenderCircle from "./Circle/RenderCircle";

export const renderCanvaElement = (
    element: CanvaElementType,
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
    } else if (element.type === "circle") {
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
