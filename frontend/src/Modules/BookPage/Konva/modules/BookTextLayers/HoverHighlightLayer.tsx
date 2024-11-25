import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Layer, Shape } from "react-konva";
import { hoveredItemsAtom } from "../../konvaAtoms";

type HoverHighlightLayerProps = {
    // Define your prop types here
};

export default function HoverHighlightLayer({}: HoverHighlightLayerProps) {
    const [hoveredItems] = useAtom(hoveredItemsAtom);

    const [renderedHover, setRenderedHover] = useState<JSX.Element[]>([]);
    const createHighlightHover = () => {

        if (!hoveredItems) {
            setRenderedHover([]);
            return;
        }
        const scaleY = 1.1;
        const scaleX = 1.25;

        setRenderedHover(
            hoveredItems.map((hover) => (
                <Shape
                    sceneFunc={(context, shape) => {
                        context.beginPath();

                        // Calculate the center of the shape
                        const centerX =
                            hover.points.reduce((sum, p) => sum + p.x, 0) /
                            hover.points.length;
                        const centerY =
                            hover.points.reduce((sum, p) => sum + p.y, 0) /
                            hover.points.length;

                        // Translate the context to the center
                        context.translate(centerX, centerY);

                        

                        // Translate back from the center
                        context.translate(-centerX, -centerY);

                        // Draw the scaled shape
                        hover.points.forEach((point, index) => {
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
                    opacity={0.5}
                />
            ))
        );
    };

    useEffect(() => {
        createHighlightHover();
    }, [hoveredItems]);
    return <Layer>{renderedHover}</Layer>;
}
