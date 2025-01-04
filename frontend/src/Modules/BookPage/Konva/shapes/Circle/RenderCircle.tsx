// src/components/CanvasElements/Circle/RenderCircle.tsx

import { Shape } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import rough from "roughjs/bin/rough";
import { SpecificCircleElement } from "../../../../../endPointTypes/types";

type RenderCircleProps = {
    draggable: boolean;
    element: SpecificCircleElement;
    handleDragMove: ((e: KonvaEventObject<MouseEvent>) => void) | undefined;
};

export default function RenderCircle({
    draggable,
    element,
    handleDragMove,
}: RenderCircleProps) {
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
            attrs={{
                elementType: "circle",
                radius: element.circleElement.radius,
            }}
            onDragMove={handleDragMove}
            sceneFunc={(context, shape) => {
                const roughCanvas = rough.canvas(context.canvas);
                context.save();
                // Move to the center of the bounding box
                context.translate(
                    element.circleElement.radius,
                    element.circleElement.radius
                );
                // Draw the circle at (0, 0) with the correct radius
                roughCanvas.circle(0, 0, element.circleElement.radius * 2, {
                    fill: element.fill,
                    stroke: element.strokeColor,
                    strokeWidth: element.strokeWidth,
                    roughness: element.circleElement.roughness,
                    fillStyle: element.circleElement.fillStyle,
                    hachureGap: element.circleElement.hachureGap,
                    hachureAngle: element.circleElement.hachureAngle,
                    seed: element.circleElement.seed,
                });
                context.restore();
                // No need to call fillStrokeShape here since rough.js handles the drawing
            }}
            hitFunc={(context, shape) => {
                context.beginPath();
                // Define the hit area at the center of the bounding box
                context.arc(
                    element.circleElement.radius,
                    element.circleElement.radius,
                    element.circleElement.radius,
                    0,
                    Math.PI * 2,
                    false
                );
                context.closePath();
                context.fillStrokeShape(shape);
            }}
        />
    );
}
