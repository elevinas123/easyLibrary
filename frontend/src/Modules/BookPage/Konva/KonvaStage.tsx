import { useAtom } from "jotai";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Stage } from "react-konva";
import { ProcessedElement } from "../../../preprocess/epub/htmlToBookElements";
import Tools from "./components/Tools";
import { getPos } from "./functions/getPos";
import {
    activeToolAtom,
    canvaElementsAtom,
    hoveredItemsAtom,
    newArrowAtom,
    offsetPositionAtom,
    scaleAtom,
    selectedItemsIdsAtom
} from "./konvaAtoms";
import MainLayer, { MainLayerRef } from "./modules/BookTextLayers/MainLayer";
import HoverHighlightLayer from "./modules/HoverLayer/HoverHighlightLayer";
import MainNotesLayer, {
    MainNotesLayerRef,
} from "./modules/NotesLayer/MainNotesLayer";
import ToolBar from "./modules/ToolBar/ToolBar";

export type VisibleArea = {
    x: number;
    y: number;
    width: number;
    height: number;
};
// ... other type definitions

type KonvaStageProps = {
    bookElements: ProcessedElement[];
};

export default function KonvaStage({ bookElements }: KonvaStageProps) {
    const fontSize = 24;
    const width = 1200;
    const [activeTool] = useAtom(activeToolAtom);
    const stageRef = useRef<any>(null);
    const [scale, setScale] = useAtom(scaleAtom); // State to handle scale
    const [isDragging, setIsDragging] = useState(false); // New state to track dragging
    const [offsetPosition, setOffsetPosition] = useAtom(offsetPositionAtom);
    const viewportBuffer = 200;
    const mainNotesLayerRef = useRef<MainNotesLayerRef | null>(null);
    const [_, setHoveredItems] = useAtom(hoveredItemsAtom);
    const [newArrow] = useAtom(newArrowAtom);
    const [canvaElements] = useAtom(canvaElementsAtom);
    const [selectedItemsIds] = useAtom(selectedItemsIdsAtom);
    const mainLayerRef = useRef<MainLayerRef | null>(null);
    useEffect(() => {}, [canvaElements]);

    // Ref to track the current animation frame
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
        // Add event listener to the document to catch keydown events
        document.addEventListener("keydown", handleKeyDown);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    useEffect(() => {
        const stage = stageRef.current;
        if (stage) {
            stage.on("wheel", handleWheel); // Attach wheel handler
        }

        return () => {
            if (stage) {
                stage.off("wheel", handleWheel); // Clean up listener
            }
        };
    }, []);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (mainNotesLayerRef.current) {
            mainNotesLayerRef.current.handleKeyDown(e);
        }
    };

    const handlePanWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        const stage = stageRef.current;
        if (!isDragging || !dragStartPos) return;

        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        // Calculate delta movement adjusted by scale
        const dx = (pointer.x - dragStartPos.x) / scale;
        const dy = (pointer.y - dragStartPos.y) / scale;

        // Update offset position
        setOffsetPosition((prev) => ({
            x: prev.x + dx * scale,
            y: prev.y + dy * scale,
        }));

        // Update drag start position
        setDragStartPos(pointer);

        stage.batchDraw();
    };

    const handleControlWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = stageRef.current;

        if (!stage) return;

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        if (!pointer) return;

        const scaleBy = 1.1;
        const direction = e.evt.deltaY > 0 ? -1 : 1;
        const newScale =
            direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        // Limit the scale range
        const minScale = 0.5;
        const maxScale = 3;
        const clampedScale = Math.max(minScale, Math.min(maxScale, newScale));

        // Calculate the scaling factor
        const scaleFactor = clampedScale / oldScale;

        // Adjust the offset position to keep the zoom centered on the pointer
        const newPos = {
            x: pointer.x - (pointer.x - stage.x()) * scaleFactor,
            y: pointer.y - (pointer.y - stage.y()) * scaleFactor,
        };

        // Update state
        setScale(clampedScale);
        setOffsetPosition(newPos);
    };

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        if (e.evt.ctrlKey) {
            handleControlWheel(e);
        } else {
            console.log("handlePanWheel");
            handlePanWheel(e);
        }
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

        // Calculate delta movement adjusted by scale
        const dx = (pointer.x - dragStartPos.x) / scale;
        const dy = (pointer.y - dragStartPos.y) / scale;

        // Update offset position
        setOffsetPosition((prev) => ({
            x: prev.x + dx * scale,
            y: prev.y + dy * scale,
        }));

        // Update drag start position
        setDragStartPos(pointer);

        stage.batchDraw();
    };

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        stage.position({
            x: offsetPosition.x,
            y: offsetPosition.y,
        });
        updateVisibleArea();
    }, [offsetPosition]);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        stage.scale({ x: scale, y: scale });
        stage.position(offsetPosition);
        stage.batchDraw();
    }, [scale, offsetPosition]);

    const handleMouseUpForPan = () => {
        setIsDragging(false);
        setDragStartPos(null);
    };

    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (activeTool === "Pan" || e.evt.buttons === 4) {
            handleMouseDownForPan();
            e.evt.preventDefault();
            return;
        }

        if (mainLayerRef.current) {
            mainLayerRef.current.handleMouseDown(e);
        }
        if (mainNotesLayerRef.current) {
            mainNotesLayerRef.current.handleMouseDown(e);
        }
    };

    const removeHoversNotUnderMouse = (e: KonvaEventObject<MouseEvent>) => {
        const pos = getPos(offsetPosition, scale, e);
        if (!pos) return;

        const isPointInPolygon = (
            point: { x: number; y: number },
            polygon: { x: number; y: number }[]
        ) => {
            let isInside = false;
            for (
                let i = 0, j = polygon.length - 1;
                i < polygon.length;
                j = i++
            ) {
                const xi = polygon[i].x,
                    yi = polygon[i].y;
                const xj = polygon[j].x,
                    yj = polygon[j].y;

                const intersect =
                    yi > point.y !== yj > point.y &&
                    point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
                if (intersect) isInside = !isInside;
            }
            return isInside;
        };

        setHoveredItems((prevItems) => {
            return prevItems.filter((item) => {
                const isInPolygon = isPointInPolygon(pos, item.points);
                const isArrowRelated =
                    newArrow &&
                    (item.id === newArrow.startId ||
                        item.id === newArrow.endId);
                return (
                    activeTool === "Arrow" && (isInPolygon || isArrowRelated)
                );
            });
        });
    };

    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        removeHoversNotUnderMouse(e);
        if (activeTool === "Pan" || e.evt.buttons === 4) {
            handleMouseMoveForPan();
            e.evt.preventDefault();
            return;
        }
        if (mainLayerRef.current) {
            mainLayerRef.current.handleMouseMove(e);
        }
        console.log("handleMouseMove");
        if (mainNotesLayerRef.current) {
            mainNotesLayerRef.current.handleMouseMove(e);
        }
    };

    const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
        if (activeTool === "Pan" || e.evt.buttons === 4) {
            handleMouseUpForPan();
            e.evt.preventDefault();
            return;
        }
        if (mainLayerRef.current) {
            mainLayerRef.current.handleMouseUp();
        }
        if (mainNotesLayerRef.current) {
            mainNotesLayerRef.current.handleMouseUp(e);
        }
    };

    const handleDoubleClick = (e: KonvaEventObject<MouseEvent>) => {
        if (mainNotesLayerRef.current) {
            mainNotesLayerRef.current.handleDoubleClick(e);
        }
    };

    const updateVisibleArea = () => {
        if (!stageRef.current) return;

        const stage = stageRef.current;

        const visibleArea = {
            x: (-stage.x() - viewportBuffer) / scale,
            y: (-stage.y() - viewportBuffer) / scale,
            width: (window.innerWidth + viewportBuffer * 2) / scale,
            height: (window.innerHeight + viewportBuffer * 2) / scale,
        };
        setVisibleArea(visibleArea);
    };

    return (
        <div className="h-screen w-full relative">
            <Tools />
            <ToolBar selectedItemsIds={selectedItemsIds} />

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
                onDblClick={handleDoubleClick}
            >
                <MainLayer
                    visibleArea={visibleArea}
                    bookElements={bookElements}
                    fontSize={fontSize}
                    width={width}
                    ref={mainLayerRef}
                />
                <HoverHighlightLayer />

                <MainNotesLayer ref={mainNotesLayerRef} />
            </Stage>
        </div>
    );
}
