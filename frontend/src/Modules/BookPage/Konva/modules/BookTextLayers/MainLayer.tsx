import { KonvaEventObject } from "konva/lib/Node";
import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from "react";
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

export type MainLayerRef = {
    handleMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseUp: () => void;
};

function MainLayer(
    { bookElements, visibleArea, fontSize, width }: MainLayerProps,
    ref: ForwardedRef<MainLayerRef>
) {
    const highlightComponentRef = useRef<HighlightLayerRef | null>(null);
    const textComponentRef = useRef<TextLayerRef | null>(null);
    useImperativeHandle(ref, () => ({
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    }));
    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (highlightComponentRef.current) {
            highlightComponentRef.current.handleMouseDown(e);
        }
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
        <Layer>
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
export default forwardRef(MainLayer);
