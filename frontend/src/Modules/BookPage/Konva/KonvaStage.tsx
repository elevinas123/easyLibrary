import { useAtom } from "jotai";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Stage } from "react-konva";
import { ProcessedElement } from "../../../preprocess/epub/htmlToBookElements";
import Tools from "./components/Tools";
import {
    activeToolAtom,
    canvaElementsAtom,
    HighlightPoints,
    hoveredItemsAtom,
    newArrowAtom,
    offsetPositionAtom,
} from "./konvaAtoms";
import MainLayer from "./modules/BookTextLayers/MainLayer";
import HoverHighlightLayer from "./modules/HoverLayer/HoverHighlightLayer";
import MainNotesLayer, {
    MainNotesLayerRef,
} from "./modules/NotesLayer/MainNotesLayer";
import axios from "axios";
import { useAuth } from "../../../hooks/userAuth";
import { Book } from "../../LibraryPage/LibraryPage";

type KonvaStageProps = {
    bookElements: ProcessedElement[];
    book: Book;
};
export type VisibleArea = {
    x: number;
    y: number;
    width: number;
    height: number;
};
// Base skeleton for all elements
export type CanvaElementSkeleton = {
    fill: string;
    x: number;
    y: number;
    width: number;
    height: number;
    id: string;
    outgoingArrowIds: string[];
    incomingArrowIds: string[];
    points: HighlightPoints[];
    strokeColor: string;
    strokeWidth: number;
    opacity: number;
};
export type StartType = "bookText" | "text" | null;

export type CurveElement = ArrowElement

export type CurveSkeleton = {
    points: number[];
    id: string;
    fill: string;
    text: null | string;
};
export interface ArrowElement extends CurveSkeleton {
    type: "arrow";
    points: number[];
    startId: string | null;
    endId: string | null;
    startType: StartType;
    endType: StartType;
}

// Specific element types
export interface BookTextElement extends CanvaElementSkeleton {
    type: "bookText";
    text: string;
    fontSize: number;
    fontFamily: string;
}

export interface CircleElement extends CanvaElementSkeleton {
    radius: number;
    type: "circle";
}

export default function KonvaStage({ bookElements, book }: KonvaStageProps) {
    const fontSize = 24;
    const width = 1200;
    const [activeTool] = useAtom(activeToolAtom);
    const stageRef = useRef<any>(null);
    const [scale, setScale] = useState(1); // State to handle scale
    const [isDragging, setIsDragging] = useState(false); // New state to track dragging
    const [offsetPosition, setOffsetPosition] = useAtom(offsetPositionAtom);
    const viewportBuffer = 200;
    const mainNotesLayerRef = useRef<MainNotesLayerRef | null>(null);
    const [_, setHoveredItems] = useAtom(hoveredItemsAtom);
    const [newArrow] = useAtom(newArrowAtom);
    const [canvaElements, setCanvaElements] = useAtom(canvaElementsAtom);

    useEffect(() => {}, [canvaElements]);

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
    useEffect(() => {
        // Add event listener to the document to catch keydown events
        document.addEventListener("keydown", handleKeyDown);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Zoom handler (existing)

    const handleKeyDown = (e: KeyboardEvent) => {
        if (mainNotesLayerRef) {
            mainNotesLayerRef.current?.handleKeyDown(e);
        }
    };

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
    const removeHoversNotUnderMouse = (e: KonvaEventObject<MouseEvent>) => {
        const pos = e.target?.getStage()?.getPointerPosition();
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
        if (mainNotesLayerRef.current) {
            mainNotesLayerRef.current.handleMouseMove(e);
        }
        if (activeTool === "Pan") {
            handleMouseMoveForPan();
        }
    };

    const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
        if (mainNotesLayerRef.current) {
            mainNotesLayerRef.current.handleMouseUp(e);
        }
        if (activeTool === "Pan") {
            handleMouseUpForPan();
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
                onDblClick={handleDoubleClick}
            >
                <MainLayer
                    visibleArea={visibleArea}
                    bookElements={bookElements}
                    fontSize={fontSize}
                    width={width}
                />
                <HoverHighlightLayer />

                <MainNotesLayer ref={mainNotesLayerRef} />
            </Stage>
        </div>
    );
}
