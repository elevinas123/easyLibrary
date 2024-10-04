import { KonvaEventObject } from "konva/lib/Node";
<<<<<<< HEAD
=======
import { CanvaElementType } from "../../../../endPointTypes/types";
import RenderRectangle from "./Rectangle/RenderRectangle";
>>>>>>> MongooseBackend
import RenderText from "./Text/RenderText";
import RenderRectangle from "./Rectangle/RenderRectangle";
import { CanvaElement } from "../konvaAtoms";

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
    } else {
        return null;
    }
};
