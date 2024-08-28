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
    const [activeTool] = useAtom(activeToolAtom);
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
                transformerRef.current.getLayer().batchDraw();
            }
            console.log("shapes", shapes, selectedShapeId);
        }
    }, [selectedShapeId]);
    useEffect(() => {}, []);

    const handleMouseDown = (e: any) => {
        if (activeTool === "Select" || activeTool === "Pan") return;

        const pos = e.target.getStage().getPointerPosition();
        const newShape: Shape = {
            type: activeTool as ShapeType,
            id: Date.now().toString(), // Generate a unique ID
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
        setSelectedShapeId(shape.id);
        shapeRefs.current[shape.id] = ref;
    };
    useEffect(() => {
        console.log("shapes", shapes);
    }, [shapes]);

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
                    {selectedShapeId && <Transformer ref={transformerRef} />}
                </Layer>
            </Stage>
            {selectedShapeId && (
                <ToolBar shapeId={selectedShapeId} setShapes={setShapes} />
            )}
        </div>
    );
}
