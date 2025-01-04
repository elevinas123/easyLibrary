import { Shape } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import rough from "roughjs/bin/rough";
import { SpecificRectElement } from "../../../../../endPointTypes/types";

type RenderRectangleProps = {
    draggable: boolean;
    element: SpecificRectElement;
    handleDragMove: ((e: KonvaEventObject<MouseEvent>) => void) | undefined;
};

export default function RenderRectangle({
    draggable,
    element,
    handleDragMove,
}: RenderRectangleProps) {
    return (
        <Shape
            key={element.id}
            id={element.id}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            opacity={element.opacity}
            draggable={draggable}
            onDragMove={handleDragMove}
            sceneFunc={(context, shape) => {
                // Create a Rough.js canvas wrapper
                const roughCanvas = rough.canvas(context.canvas);

                // Save the context state
                context.save();

                // Apply transformations
                context.rotate((shape.rotation() * Math.PI) / 180);

                // Draw the rough rectangle at (0, 0)
                roughCanvas.rectangle(0, 0, element.width, element.height, {
                    fill: element.fill,
                    stroke: element.strokeColor,
                    strokeWidth: element.strokeWidth,
                    roughness: element.rectElement.roughness,
                    fillStyle: element.rectElement.fillStyle,
                    hachureGap: element.rectElement.hachureGap,
                    hachureAngle: element.rectElement.hachureAngle,
                    seed: element.rectElement.seed,
                });

                // Restore the context state
                context.restore();
                context.rect(0, 0, element.width, element.height);
                // Tell Konva that the drawing is complete
                context.fillStrokeShape(shape);
            }}
        />
    );
}
