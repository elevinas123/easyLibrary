import { KonvaEventObject } from "konva/lib/Node";
import { useRef } from "react";
import { Layer } from "react-konva";
import { VisibleArea } from "../../KonvaStage";

import HighlightLayer, { HighlightLayerRef } from "./HighlightLayer";
import TextLayer, { TextLayerRef } from "./TextLayer";
import { ProcessedElement } from "../../../../../preprocess/epub/htmlToBookElements";

type MainLayerProps = {
    bookElements: ProcessedElement[];
    visibleArea: VisibleArea;
    fontSize: number;
    width: number;
};

export default function MainLayer({
    bookElements,
    visibleArea,
    fontSize,
    width,
}: MainLayerProps) {
    const highlightComponentRef = useRef<HighlightLayerRef | null>(null);
    const textComponentRef = useRef<TextLayerRef | null>(null);

    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (textComponentRef.current) {
            textComponentRef.current.handleMouseDown(e);
        }
    };
    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        if (textComponentRef.current) {
            textComponentRef.current.handleMouseMove(e);
        }
        if (highlightComponentRef.current) {
            highlightComponentRef.current.handleMouseMove(e);
        }
    };
    const handleMouseUp = () => {
        if (textComponentRef.current) {
            textComponentRef.current.handleMouseUp();
        }
    };

    return (
        <Layer
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <HighlightLayer
                ref={highlightComponentRef}
                processedElements={bookElements}
                visibleArea={visibleArea}
                fontSize={fontSize}
            />
            <TextLayer
                ref={textComponentRef}
                processedElements={bookElements}
                visibleArea={visibleArea}
                fontSize={fontSize}
                width={width}
            />
        </Layer>
    );
}
