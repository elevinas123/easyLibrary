import { useEffect, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import { useAtom } from "jotai";
import { activeToolAtom, offsetPositionAtom } from "./konvaAtoms";
import Tools from "./components/Tools";
import ToolBar from "./components/ToolBar";
import Rectangle from "./shapes/Rectangle";
import CustomTransformer from "./shapes/CustomTransformer";
import CircleItem from "./Circle";
import TextItem from "./shapes/TextShape";
import { HtmlObject } from "../../../preprocess/epub/preprocessEpub";
import { KonvaEventObject } from "konva/lib/Node";
import MainLayer from "./modules/BookTextLayers.tsx/MainLayer";
import MainNotesLayer, {
    MainNotesLayerRef,
} from "./modules/NotesLayer/MainNotesLayer";

type KonvaStageProps = {
    bookElements: (HtmlObject | null)[];
};
export type VisibleArea = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export default function KonvaStage({ bookElements }: KonvaStageProps) {
    const fontSize = 24;
    const width = 1200;
    const [activeTool] = useAtom(activeToolAtom);
    const stageRef = useRef<any>(null);
    const [scale, setScale] = useState(1); // State to handle scale
    const [isDragging, setIsDragging] = useState(false); // New state to track dragging
    const [offsetPosition, setOffsetPosition] = useAtom(offsetPositionAtom);
    const viewportBuffer = 200;
    const mainNotesLayerRef = useRef<MainNotesLayerRef | null>(null);
    const [dragStartPos, setDragStartPos] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const [visibleArea, setVisibleArea] = useState<VisibleArea>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    useEffect(() => {
        updateVisibleArea();
    }, [offsetPosition]);

    useEffect(() => {
        const stage = stageRef.current;
        if (stage) {
            stage.on("wheel", handleWheel); // Attach zoom on mouse wheel
        }

        return () => {
            if (stage) {
                stage.off("wheel", handleWheel); // Clean up listener
            }
        };
    }, []);

    // Zoom handler (existing)
    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = stageRef.current;

        // Get the current scale and adjust it based on scroll direction
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const scaleBy = 1.1; // Scale factor
        const newScale =
            e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

        setScale(newScale);

        // Calculate new position to keep zoom centered on the pointer
        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        stage.scale({ x: newScale, y: newScale });
        stage.position(newPos);
        stage.batchDraw();
    };

    // Pan Handlers
    const handleMouseDownForPan = () => {
        const stage = stageRef.current;
        setIsDragging(true);
        const pos = stage.getPointerPosition();
        if (pos) {
            setDragStartPos(pos); // Store the initial position
        }
    };

    const handleMouseMoveForPan = () => {
        const stage = stageRef.current;
        if (!isDragging || !dragStartPos) return;

        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const dx = pointer.x - dragStartPos.x;
        const dy = pointer.y - dragStartPos.y;

        stage.position({
            x: stage.x() + dx,
            y: stage.y() + dy,
        });
        setOffsetPosition((offset) => ({ x: offset.x + dx, y: offset.y + dy }));

        setDragStartPos(pointer); // Update the drag position to the current one
        stage.batchDraw(); // Update the canvas
    };

    const handleMouseUpForPan = () => {
        setIsDragging(false);
        setDragStartPos(null);
    };

    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (mainNotesLayerRef.current) {
            mainNotesLayerRef.current.handleMouseDown(e);
        }
        if (activeTool === "Pan") {
            handleMouseDownForPan();
        }
    };

    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        if (mainNotesLayerRef.current) {
            mainNotesLayerRef.current.handleMouseMove(e);
        }
        if (activeTool === "Pan") {
            handleMouseMoveForPan();
        }
    };

    const handleMouseUp = () => {
        if (mainNotesLayerRef.current) {
            mainNotesLayerRef.current.handleMouseUp();
        }
        if (activeTool === "Pan") {
            handleMouseUpForPan();
        }
    };

    const updateVisibleArea = () => {
        if (!stageRef.current) return;

        const stage = stageRef.current;
        const visibleArea = {
            x: -stage.x() - viewportBuffer,
            y: -stage.y() - viewportBuffer,
            width: window.innerWidth + viewportBuffer * 2,
            height: window.innerHeight + viewportBuffer * 2,
        };
        setVisibleArea(visibleArea);
    };

    return (
        <div className="h-screen w-full relative">
            <Tools />
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                ref={stageRef}
                scaleX={scale}
                scaleY={scale}
                draggable={false} // Prevent Konva's built-in drag
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <MainLayer
                    visibleArea={visibleArea}
                    bookElements={bookElements}
                    fontSize={fontSize}
                    width={width}
                />
                <MainNotesLayer ref={mainNotesLayerRef} />
            </Stage>
        </div>
    );
}
