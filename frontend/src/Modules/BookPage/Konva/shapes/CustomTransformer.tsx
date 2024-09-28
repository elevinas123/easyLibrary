import { useEffect, useRef } from "react";
import { Transformer } from "react-konva";
import Konva from "konva";
import { CanvaElement } from "../konvaAtoms";

type CustomTransformerProps = {
    selectedIds: string[];
    updateElementInState: (id: string, newAttrs: Partial<CanvaElement>) => void;
};

export default function CustomTransformer({
    selectedIds,
    updateElementInState,
}: CustomTransformerProps) {
    const transformerRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
        const transformer = transformerRef.current;
        if (!transformer) return;

        const stage = transformer.getStage();
        if (!stage) return;

        // Find the nodes corresponding to the selected IDs
        let selectedNodes = selectedIds
            .map((id) => stage.findOne<Konva.Node>(`#${id}`))
            .filter((node) => node !== null)
            .filter((node) => node !== undefined);
        console.log(selectedNodes);
        // Attach the transformer to the selected nodes

        transformer.nodes(selectedNodes);
        transformer.getLayer()?.batchDraw();
    }, [selectedIds]);

    // Handle transformations
    useEffect(() => {
        const transformer = transformerRef.current;
        if (!transformer) return;

        const handleTransformEnd = () => {
            const nodes = transformer.nodes();
            nodes.forEach((node) => {
                const id = node.id();
                const type = node.getClassName();

                let newAttrs: Partial<CanvaElement> = {};

                if (type === "Rect") {
                    newAttrs = {
                        x: node.x(),
                        y: node.y(),
                        width: node.width() * node.scaleX(),
                        height: node.height() * node.scaleY(),
                        rotation: node.rotation(),
                    };
                } else if (type === "Text") {
                    newAttrs = {
                        x: node.x(),
                        y: node.y(),
                        width: node.width() * node.scaleX(),
                        height: node.height() * node.scaleY(),
                        text: (node as Konva.Text).text(),
                        fontSize:
                            (node as Konva.Text).fontSize() * node.scaleY(),
                        rotation: node.rotation(),
                    };
                }
                // Reset scale to avoid double-scaling
                node.scaleX(1);
                node.scaleY(1);

                // Update the element in the application state
                updateElementInState(id, newAttrs);
            });
        };

        // Attach the event handler
        transformer.on("transformend", handleTransformEnd);

        // Cleanup the event handler on unmount or when dependencies change
        return () => {
            transformer.off("transformend", handleTransformEnd);
        };
    }, [updateElementInState]);

    return <Transformer ref={transformerRef} />;
}
