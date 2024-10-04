// RenderArrow.tsx

import { Shape } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import rough from "roughjs/bin/rough";
import { ArrowElementType } from "../../../../../endPointTypes/types";

// Define the component's props
type RenderArrowProps = {
    element: ArrowElementType;
    draggable: boolean;
    handleDragMove: ((e: KonvaEventObject<MouseEvent>) => void) | undefined;
};

// Helper function to draw arrowhead with styling
const drawArrowHead = (
    context: CanvasRenderingContext2D,
    relativeX2: number,
    relativeY2: number,
    angle: number,
    element: ArrowElementType
) => {
    const arrowLength = 10; // Length of the arrowhead lines
    const arrowAngle = Math.PI / 6; // 30 degrees

    // Calculate the two points for the arrowhead
    const arrowX1 = relativeX2 - arrowLength * Math.cos(angle - arrowAngle);
    const arrowY1 = relativeY2 - arrowLength * Math.sin(angle - arrowAngle);
    const arrowX2 = relativeX2 - arrowLength * Math.cos(angle + arrowAngle);
    const arrowY2 = relativeY2 - arrowLength * Math.sin(angle + arrowAngle);

    // Begin path for arrowhead
    context.beginPath();
    context.moveTo(relativeX2, relativeY2);
    context.lineTo(arrowX1, arrowY1);
    context.lineTo(arrowX2, arrowY2);
    context.closePath();

    // Set fill and stroke styles
    context.fillStyle = element.fill || "black";
    context.strokeStyle = element.stroke || "black";
    context.lineWidth = element.strokeWidth || 2;

    // Apply stroke style patterns if any
    switch (element.strokeStyle) {
        case "dashed":
            context.setLineDash([10, 5]);
            break;
        case "dotted":
            context.setLineDash([2, 3]);
            break;
        default:
            context.setLineDash([]);
    }

    // Fill and stroke the arrowhead
    context.fill();
    context.stroke();

    // Reset line dash
    context.setLineDash([]);
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

    // Extract the first four points (x1, y1, x2, y2)
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

                // Draw the main line of the arrow with styling
                roughCanvas.line(0, 0, relativeX2, relativeY2, {
                    stroke: element.stroke || "black",
                    strokeWidth: element.strokeWidth || 2,
                    roughness: element.roughness || 1,
                    bowing: element.bowing || 1,
                    seed: element.seed,
                });

                // Calculate the angle of the line
                const angle = Math.atan2(relativeY2, relativeX2);

                // Draw the arrowhead with styling
                drawArrowHead(context, relativeX2, relativeY2, angle, element);

                // Finalize the shape
                context.fillStrokeShape(shape);
            }}
            // Optionally, you can add additional event handlers here
            // e.g., onClick, onMouseEnter, etc.
        />
    );
}
