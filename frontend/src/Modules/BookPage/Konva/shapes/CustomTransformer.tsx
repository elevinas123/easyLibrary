import { useEffect, useRef } from "react";
import { Transformer } from "react-konva";
import { CanvaElement } from "./CanvaElement";

type CustomTransformerProps = {
    currentElements: CanvaElement[] | null
};

export default function CustomTransformer({
    currentElements,
}: CustomTransformerProps) {
    const transformerRef = useRef<any>(null);

    useEffect(() => {
        const transformer = transformerRef.current;

        if (transformer) {
            const stage = transformer.getStage();

            if (stage && currentElements) {
                // Find nodes for selected shape IDs
                console.log(currentElements);
                const selectedNodes = currentElements
                .map((element) => stage.findOne(`#${element.id}`)) // Find by node's ID
                .filter((node) => node !== null && node !==undefined); // Filter out null nodes
                console.log(selectedNodes);
                // Only update the transformer if valid nodes were found
                if (selectedNodes.length > 0) {
                    transformer.nodes(selectedNodes);
                    transformer.getLayer().batchDraw(); // Re-draw layer to reflect changes
                } else {
                    // If no valid nodes are found, clear the transformer
                    transformer.nodes([]);
                    transformer.getLayer().batchDraw();
                }
            }
        }
    }, [currentElements]);

    return <Transformer ref={transformerRef} handleS/>;
}
