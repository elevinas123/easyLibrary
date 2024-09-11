import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { activeToolAtom, hoveredHighlightAtom } from "../../konvaAtoms";
import { Shape } from "react-konva";

type HoverHighlightLayerProps = {
    // Define your prop types here
};

export default function HoverHighlightLayer({}: HoverHighlightLayerProps) {
    const [hoveredHighlight] = useAtom(hoveredHighlightAtom);

    const [activeTool] = useAtom(activeToolAtom);
    const [renderedHover, setRenderedHover] = useState<JSX.Element | null>(
        null
    );
    const createHighlightHover = () => {
        console.log("hoveredHighlight", hoveredHighlight);

        if (!hoveredHighlight) {
            setRenderedHover(null);
            return;
        }
        const scaleY = 1.1;
        const scaleX = 1.25;

        setRenderedHover(
            <Shape
                sceneFunc={(context, shape) => {
                    context.beginPath();

                    // Calculate the center of the shape
                    const centerX =
                        hoveredHighlight.points.reduce(
                            (sum, p) => sum + p.x,
                            0
                        ) / hoveredHighlight.points.length;
                    const centerY =
                        hoveredHighlight.points.reduce(
                            (sum, p) => sum + p.y,
                            0
                        ) / hoveredHighlight.points.length;

                    // Translate the context to the center
                    context.translate(centerX, centerY);

                    // Scale the context
                    context.scale(scaleY, scaleX);

                    // Translate back from the center
                    context.translate(-centerX, -centerY);

                    // Draw the scaled shape
                    hoveredHighlight.points.forEach((point, index) => {
                        const scaledX = point.x;
                        const scaledY = point.y;
                        if (index === 0) {
                            context.moveTo(scaledX, scaledY);
                        } else {
                            context.lineTo(scaledX, scaledY);
                        }
                    });

                    context.closePath();
                    context.fillStrokeShape(shape);
                }}
                fill="red"
                stroke="black"
                strokeWidth={2}
            />
        );

    };

    useEffect(() => {
        createHighlightHover();
    }, [hoveredHighlight]);
    return <>{renderedHover}</>;
}
