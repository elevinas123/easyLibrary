import { KonvaEventObject } from "konva/lib/Node";
import { DrawingToolNames } from "../components/Tools";
import { CanvaElement } from "./CanvasElement";
import RenderRectangle from "./Rectangle/RenderRectangle";
import RenderText from "./Text/RenderText";

export const renderCanvaElement = (
    element: CanvaElement,
    activeTool: DrawingToolNames,
    handleDragMove: (e: KonvaEventObject<MouseEvent>) => void
) => {
    if (element.type === "text") {
        return (
            <RenderText
                element={element}
                draggable={activeTool === "Select"}
                handleDragMove={handleDragMove}
                key={element.id}
            />
        );
    } else if (element.type === "rect") {
        return (
            <RenderRectangle
                draggable={activeTool === "Select"}
                element={element}
                handleDragMove={handleDragMove}
                key={element.id}
            />
        );
    }
};
