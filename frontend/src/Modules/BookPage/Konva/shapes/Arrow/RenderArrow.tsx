import { Shape } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import rough from "roughjs/bin/rough";
import { ArrowElement } from "./ArrowShape";

// Define the component's props
type RenderArrowProps = {
    element: ArrowElement;
    draggable: boolean;
    handleDragMove: ((e: KonvaEventObject<MouseEvent>) => void) | undefined;
};

// RenderArrow Component
export default function RenderArrow({
    element,
    draggable,
    handleDragMove,
}: RenderArrowProps) {
    const points = element.points;

    // Ensure there are at least two points to form an arrow
    if (points.length < 4) {
        console.error("ArrowElement requires at least two points.");
        return null;
    }

    // Extract the first two points
    const [x1, y1, x2, y2] = points;

    // Calculate relative position for rendering within the Shape
    const relativeX2 = x2 - x1;
    const relativeY2 = y2 - y1;

    return (
        <Shape
            key={element.id}
            id={element.id}
            x={x1}
            y={y1}
            draggable={draggable}
            onDragMove={handleDragMove}
            sceneFunc={(context, shape) => {
                const roughCanvas = rough.canvas(context.canvas);

                // Draw the main line of the arrow
                roughCanvas.line(0, 0, relativeX2, relativeY2, {
                    stroke: element.fill || "black",
                    strokeWidth: 2,
                    roughness: 1,
                    seed: element.seed,
                    bowing: element.bowing,
                    fillWeight: element.fillWeight,
                    hachureAngle: element.hachureAngle,
                    hachureGap: element.hachureGap,
                    fillStyle: element.fillStyle,
                });

                // Calculate the angle of the line
                const angle = Math.atan2(relativeY2, relativeX2);

                // Define arrowhead dimensions
                const arrowLength = 10;
                const arrowAngle = Math.PI / 6; // 30 degrees

                // Calculate the two points for the arrowhead
                const arrowX1 =
                    relativeX2 - arrowLength * Math.cos(angle - arrowAngle);
                const arrowY1 =
                    relativeY2 - arrowLength * Math.sin(angle - arrowAngle);
                const arrowX2 =
                    relativeX2 - arrowLength * Math.cos(angle + arrowAngle);
                const arrowY2 =
                    relativeY2 - arrowLength * Math.sin(angle + arrowAngle);

                // Draw the arrowhead
                context.beginPath();
                context.moveTo(relativeX2, relativeY2);
                context.lineTo(arrowX1, arrowY1);
                context.lineTo(arrowX2, arrowY2);
                context.closePath();
                context.fillStyle = element.fill || "black";
                context.fill();
                context.stroke();

                // Finalize the shape
                context.fillStrokeShape(shape);
            }}
        />
    );
}
