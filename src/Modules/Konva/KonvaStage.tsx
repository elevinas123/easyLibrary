import { useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import { useAtom } from "jotai";
import { activeToolAtom } from "./konvaAtoms";
import Tools from "./components/Tools";
import ToolBar from "./components/ToolBar";
import Rectangle from "./shapes/Rectangle";

export type ShapeType = "Rectangle" | "Circle" | "Arrow" | "Line";
export type StrokeStyle = {
    type: string;
    value: number[];
};

export type Shape = {
    type: ShapeType;
    id: string;
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

const initialRectangles: Shape[] = [
    {
        type: "Rectangle",
        id: "rect1",
        x: 50,
        y: 50,
        width: 120,
        height: 80,
        points: [],
        color: "red",
        strokeColor: "black",
        backgroundColor: "yellow", // Changed to "fill" later
        strokeWidth: 2,
        opacity: 0.8,
        strokeStyle: { type: "solid", value: [0] },
    },
    {
        type: "Rectangle",
        id: "rect2",
        x: 200,
        y: 200,
        width: 150,
        height: 100,
        points: [],
        color: "blue",
        strokeColor: "green",
        backgroundColor: "lightblue", // Changed to "fill" later
        strokeWidth: 3,
        opacity: 0.9,
        strokeStyle: { type: "dashed", value: [5, 5] },
    },
];

export default function KonvaStage() {
    const [activeTool, setActiveTool] = useAtom(activeToolAtom);
    const [shapes, setShapes] = useState<Shape[]>(initialRectangles);
    const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
    const stageRef = useRef<any>(null);

    const selectShape = (id: string) => {
        if (activeTool === "Select") {
            console.log("id", id)
            setSelectedShapeId(id);
        }
    };

    const handleChange = (newAttrs: Shape, id: string) => {
        setShapes((oldShapes) =>
            oldShapes.map((shape) => (shape.id === id ? newAttrs : shape))
        );
    };

    const renderShape = (shape: Shape, index: number) => {
        switch (shape.type) {
            case "Rectangle":
                return (
                    <Rectangle
                        key={shape.id}
                        shape={shape}
                        isSelected={shape.id === selectedShapeId}
                        onSelect={() => selectShape(shape.id)}
                        onChange={(newAttrs: Shape) =>
                            handleChange(newAttrs, shape.id)
                        }
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-screen w-full relative">
            <Tools />
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                ref={stageRef}
            >
                <Layer>
                    {shapes.map((shape, index) => renderShape(shape, index))}
                </Layer>
            </Stage>
            {selectedShapeId && (
                <ToolBar shapeId={selectedShapeId} shape={shapes.filter((shape)=> shape.id === selectedShapeId)[0] || null} setShapes={setShapes} />
            )}
        </div>
    );
}
