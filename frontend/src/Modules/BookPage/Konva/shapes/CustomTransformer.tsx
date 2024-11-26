import { useEffect, useRef } from "react";
import { Transformer } from "react-konva";
import Konva from "konva";
import { CanvaElementType } from "../../../../endPointTypes/types";

type CustomTransformerProps = {
    selectedIds: string[];
    updateElementInState: (
        id: string,
        newAttrs: Partial<CanvaElementType>
    ) => void;
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
            .filter((node) => node !== null && node !== undefined);

        // Attach the transformer to the selected nodes
        transformer.nodes(selectedNodes);
        transformer.getLayer()?.batchDraw();

        // Optionally, customize the transformer for circles
        if (
            selectedNodes.length === 1 &&
            selectedNodes[0].getClassName() === "Shape"
        ) {
            const node = selectedNodes[0];
            const type = node.getAttr("elementType"); // Assuming you store the type in attrs

            if (type === "circle") {
                transformer.enabledAnchors([
                    "top-left",
                    "top-right",
                    "bottom-left",
                    "bottom-right",
                ]);
                transformer.setAttrs({
                    rotationEnabled: false,
                });
            } else {
                transformer.enabledAnchors([
                    "top-left",
                    "top-center",
                    "top-right",
                    "middle-right",
                    "bottom-right",
                    "bottom-center",
                    "bottom-left",
                    "middle-left",
                ]);
                transformer.setAttrs({
                    rotationEnabled: true,
                });
            }
        }
    }, [selectedIds]);

    // Handle transformations
    useEffect(() => {
        const transformer = transformerRef.current;
        if (!transformer) return;

        const handleTransformEnd = () => {
            const nodes = transformer.nodes();
            nodes.forEach((node) => {
                const id = node.id();
                const type = node.getAttr("elementType"); // Retrieve the custom type

                let newAttrs: Partial<CanvaElementType> = {};

                if (type === "rect") {
                    newAttrs = {
                        x: node.x(),
                        y: node.y(),
                        width: node.width() * node.scaleX(),
                        height: node.height() * node.scaleY(),
                    };
                } else if (type === "text") {
                    newAttrs = {
                        x: node.x(),
                        y: node.y(),
                        width: node.width() * node.scaleX(),
                        height: node.height() * node.scaleY(),
                        text: (node as Konva.Text).text(),
                        fontSize:
                            (node as Konva.Text).fontSize() * node.scaleY(),
                    };
                } // CustomTransformer.tsx

                if (type === "circle") {
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    const oldRadius = node.getAttr("radius");
                    const newRadius = (oldRadius * (scaleX + scaleY)) / 2;

                    newAttrs = {
                        radius: newRadius,
                        width: newRadius * 2,
                        height: newRadius * 2,
                        x: node.x(),
                        y: node.y(),
                    };

                    // Reset scale to avoid double-scaling
                    node.scaleX(1);
                    node.scaleY(1);
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
