import { useEffect, useRef } from "react";
import { Transformer } from "react-konva";

type CustomTransformerProps = {
    selectedShapeIds: string[];
    shapeRefs: { [key: string]: any };
};

export default function CustomTransformer({
    selectedShapeIds,
    shapeRefs,
}: CustomTransformerProps) {
    const transformerRef = useRef<any>(null);

    useEffect(() => {
        const transformer = transformerRef.current;
        if (transformer && selectedShapeIds.length > 0) {
            // Attach selected nodes (shapes) to the Transformer
            const selectedNodes = selectedShapeIds.map((id) => shapeRefs[id]);
            transformer.nodes(selectedNodes);
            transformer.getLayer().batchDraw();
        }
    }, [selectedShapeIds, shapeRefs]);

    return <Transformer ref={transformerRef} />;
}
