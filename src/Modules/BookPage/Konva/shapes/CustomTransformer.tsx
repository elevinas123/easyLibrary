import { useEffect, useRef } from "react";
import { Transformer } from "react-konva";

type CustomTransformerProps = {
    selectedShapeIds: string[];
};

export default function CustomTransformer({
    selectedShapeIds,
}: CustomTransformerProps) {
    const transformerRef = useRef<any>(null);

    useEffect(() => {
        const transformer = transformerRef.current;

        if (transformer) {
            const stage = transformer.getStage();

            if (stage) {
                // Find nodes for selected shape IDs
                const selectedNodes = selectedShapeIds
                    .map((id) => stage.findOne(`#${id}`)) // Find the node by its ID
                    .filter(
                        (node) => node !== null && stage.isAncestorOf(node)
                    ); // Ensure the node exists and is part of the stage

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
    }, [selectedShapeIds]);

    return <Transformer ref={transformerRef} />;
}
