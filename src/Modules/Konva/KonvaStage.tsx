import  { useRef, useState } from "react";
import { Stage, Layer, Rect, Circle, Line, Arrow } from "react-konva";
import { useAtom } from "jotai";
import { activeToolAtom } from "./konvaAtoms";
import Tools, { DrawingToolNames } from "./components/Tools";
import ToolBar from "./components/ToolBar";

type Shape = {
    type: DrawingToolNames
    x: number
    y: number
    width: number
    height: number
    points: number[]
    color: string
    radius?: number
}

export default function KonvaStage() {
    const [activeTool] = useAtom(activeToolAtom);
    const [shapes, setShapes] = useState<any[]>([]);
    const [currentShape, setCurrentShape] = useState<Shape | null>(null);
    const stageRef = useRef(null);

    const handleMouseDown = (e: any) => {
        if (activeTool === "Select" || activeTool === "Pan") return;

        const pos = e.target.getStage().getPointerPosition();
        const newShape: Shape = {
            type: activeTool,
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
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

    const renderShape = (shape: Shape, index: number) => {
        switch (shape.type) {
            case "Rectangle":
                return (
                    <Rect
                        key={index}
                        x={shape.x}
                        y={shape.y}
                        width={shape.width}
                        height={shape.height}
                        fill={shape.color}
                        stroke="black"
                    />
                );
            case "Circle":
                return (
                    <Circle
                        key={index}
                        x={shape.x}
                        y={shape.y}
                        radius={shape.radius}
                        fill={shape.color}
                        stroke="black"
                    />
                );
            case "Arrow":
                return (
                    <Arrow key={index} points={shape.points} stroke="black" />
                );
            case "Line":
                return (
                    <Line key={index} points={shape.points} stroke="black" />
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-screen w-full relative">
            <Tools />
            <ToolBar />
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
                </Layer>
            </Stage>
        </div>
    );
}
