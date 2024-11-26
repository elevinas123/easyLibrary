// src/components/CanvasElements/Circle/RenderCircle.tsx

import { Shape } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import rough from "roughjs/bin/rough";
import { CircleElementType } from "../../../../../endPointTypes/types";

type RenderCircleProps = {
    draggable: boolean;
    element: CircleElementType;
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
            x={element.x - element.radius}
            y={element.y - element.radius}
            opacity={element.opacity}
            draggable={draggable}
            onDragMove={handleDragMove}
            sceneFunc={(context, shape) => {
                const roughCanvas = rough.canvas(context.canvas);
                context.save();
                context.translate(element.radius, element.radius);
                roughCanvas.circle(0, 0, element.radius * 2, {
                    fill: element.fill,
                    stroke: element.strokeColor,
                    strokeWidth: element.strokeWidth,
                    roughness: element.roughness,
                    fillStyle: element.fillStyle,
                    hachureGap: element.hachureGap,
                    hachureAngle: element.hachureAngle,
                    seed: element.seed,
                });
                context.restore();
                context.beginPath();
                context.arc(0, 0, element.radius, 0, Math.PI * 2, false);
                context.closePath();
                context.fillStrokeShape(shape);
            }}
        />
    );
}
