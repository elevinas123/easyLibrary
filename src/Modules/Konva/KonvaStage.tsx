import { useRef, useState, useEffect } from "react";
import {
    Stage,
    Layer,
    Rect,
    Circle,
    Line,
    Arrow,
    Transformer,
} from "react-konva";
import { useAtom } from "jotai";
import { activeToolAtom } from "./konvaAtoms";
import Tools from "./components/Tools";
import ToolBar from "./components/ToolBar";

export type ShapeType = "Rectangle" | "Circle" | "Arrow" | "Line";
export type StrokeStyle = {
    type: string;
    value: number[];
};

export type Shape = {
    type: ShapeType;
    id: string; // Unique ID for each shape
    x: number;
    y: number;
    width: number;
    height: number;
    points: number[];
    color: string;
    strokeColor: string;
    backgroundColor: string;
    strokeWidth: number;
    opacity: number;
    strokeStyle: StrokeStyle;
    radius?: number;
};

export default function KonvaStage() {
    const [activeTool, setActiveTool] = useAtom(activeToolAtom);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [currentShape, setCurrentShape] = useState<Shape | null>(null);
    const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
    const stageRef = useRef<any>(null);
    const transformerRef = useRef<any>(null);
    const shapeRefs = useRef<Record<string, any>>({});

    useEffect(() => {
        if (transformerRef.current && selectedShapeId) {
            const shapeNode = shapeRefs.current[selectedShapeId];
            if (shapeNode) {
                transformerRef.current.nodes([shapeNode]);
console.log("shapeNode", shapeNode, transformerRef)
                // Allow resizing in all directions
                transformerRef.current.keepRatio(false);
                transformerRef.current.enabledAnchors([
                    "top-left",
                    "top-right",
                    "bottom-left",
                    "bottom-right",
                    "top-center",
                    "bottom-center",
                    "middle-left",
                    "middle-right",
                ]);

                transformerRef.current.getLayer().batchDraw();
            }
        }
    }, [selectedShapeId]);

    // Manually trigger cursor change on mount
    useEffect(() => {
        const stage = stageRef.current;

        if (stage) {
            // Force re-attaching events
            stage.container().style.cursor = "default";

            stage.on("mouseenter", (e: any) => {
                if (e.target === stage) return;
                stage.container().style.cursor = "move";
            });

            stage.on("mouseleave", () => {
                stage.container().style.cursor = "default";
            });
        }
    }, [shapes]);

    const handleMouseDown = (e: any) => {
        const pos = e.target.getStage().getPointerPosition();

        // Check if click is within any shape's bounding box
        const clickedShape = shapes.find((shape) => {
            const shapeRef = shapeRefs.current[shape.id];
            if (shapeRef) {
                const box = shapeRef.getClientRect();
                return (
                    pos.x >= box.x &&
                    pos.x <= box.x + box.width &&
                    pos.y >= box.y &&
                    pos.y <= box.y + box.height
                );
            }
            return false;
        });

        if (clickedShape) {
            // Select the shape if it's clicked
            setSelectedShapeId(clickedShape.id);
            setCurrentShape(null)
            console.log("shapedClicked", clickedShape, shapeRefs)
            
        } else if (activeTool !== "Select" && activeTool !== "Pan") {
            // If no shape is clicked and we're drawing a new shape
            const newShape: Shape = {
                type: activeTool as ShapeType,
                id: Date.now().toString(),
                x: pos.x,
                y: pos.y,
                width: 0,
                height: 0,
                strokeColor: "green",
                backgroundColor: "red",
                strokeWidth: 2.5,
                strokeStyle: { type: "solid", value: [1000] },
                opacity: 1,
                points: [pos.x, pos.y],
                color: "black",
            };

            setCurrentShape(newShape);
        }
    };


    const handleMouseEnter = (e: any) => {
        const stage = e.target.getStage();
        if (stage) {
            stage.container().style.cursor = "move";
        }
    };

    const handleMouseLeave = (e: any) => {
        const stage = e.target.getStage();
        if (stage) {
            stage.container().style.cursor = "default";
        }
    };

    const handleMouseMove = (e: any) => {
        if (!currentShape) return;

        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        let updatedShape = { ...currentShape };

        switch (activeTool) {
            case "Rectangle":
                updatedShape.width = point.x - updatedShape.x;
                updatedShape.height = point.y - updatedShape.y;
                break;
            case "Circle":
                const radius = Math.sqrt(
                    Math.pow(point.x - updatedShape.x, 2) +
                        Math.pow(point.y - updatedShape.y, 2)
                );
                updatedShape.radius = radius;
                break;
            case "Arrow":
            case "Line":
                updatedShape.points = [
                    updatedShape.x,
                    updatedShape.y,
                    point.x,
                    point.y,
                ];
                break;
            default:
                break;
        }

        setCurrentShape(updatedShape);
    };

    const handleMouseUp = () => {
        if (currentShape) {
            setActiveTool("Select");
            setShapes([...shapes, currentShape]);
            setCurrentShape(null);
        }
    };

    const handleDragEnd = (e: any) => {
        const updatedShapes = shapes.map((shape) => {
            if (shape.id === e.target.id()) {
                return {
                    ...shape,
                    x: e.target.x(),
                    y: e.target.y(),
                };
            }
            return shape;
        });
        setShapes(updatedShapes);
    };

    const handleShapeClick = (shape: Shape, ref: any) => {
        if (activeTool === "Select") {
            setCurrentShape(null)
            shapeRefs.current[shape.id] = ref;
            setSelectedShapeId(shape.id);
        }
    };

    const renderShape = (shape: Shape, index: number) => {
        switch (shape.type) {
            case "Rectangle":
                return (
                    <Rect
                        key={index}
                        id={shape.id}
                        ref={(node: any) => handleShapeClick(shape, node)}
                        x={shape.x}
                        y={shape.y}
                        width={shape.width}
                        height={shape.height}
                        fill={shape.backgroundColor}
                        stroke={shape.strokeColor}
                        strokeWidth={shape.strokeWidth}
                        opacity={shape.opacity}
                        dash={shape.strokeStyle.value}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        draggable
                        onDragEnd={handleDragEnd}
                    />
                );
            case "Circle":
                return (
                    <Circle
                        key={index}
                        id={shape.id}
                        ref={(node: any) => handleShapeClick(shape, node)}
                        x={shape.x}
                        y={shape.y}
                        radius={shape.radius || 0}
                        fill={shape.color}
                        stroke="black"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        draggable
                        onDragEnd={handleDragEnd}
                    />
                );
            case "Arrow":
                return (
                    <Arrow
                        key={index}
                        id={shape.id}
                        ref={(node: any) => handleShapeClick(shape, node)}
                        points={shape.points}
                        stroke="black"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        draggable
                        onDragEnd={handleDragEnd}
                    />
                );
            case "Line":
                return (
                    <Line
                        key={index}
                        id={shape.id}
                        ref={(node: any) => handleShapeClick(shape, node)}
                        points={shape.points}
                        stroke="black"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        draggable
                        onDragEnd={handleDragEnd}
                    />
                );
        }
    };

    return (
        <div className="h-screen w-full relative">
            <Tools />
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                ref={stageRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <Layer>
                    {shapes.map((shape, index) => renderShape(shape, index))}
                    {currentShape && renderShape(currentShape, shapes.length)}
                    {selectedShapeId && (
                        <Transformer
                            ref={transformerRef}
                            boundBoxFunc={(oldBox, newBox) => newBox} // Keeps bounding box functionality
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        />
                    )}
                </Layer>
            </Stage>
            {selectedShapeId && (
                <ToolBar shapeId={selectedShapeId} setShapes={setShapes} />
            )}
        </div>
    );
}