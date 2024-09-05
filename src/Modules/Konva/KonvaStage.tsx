import { useEffect, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import { useAtom } from "jotai";
import { activeToolAtom } from "./konvaAtoms";
import Tools from "./components/Tools";
import ToolBar from "./components/ToolBar";
import Rectangle from "./shapes/Rectangle";
import CustomTransformer from "./shapes/CustomTransformer";

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
        backgroundColor: "yellow",
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
        backgroundColor: "lightblue",
        strokeWidth: 3,
        opacity: 0.9,
        strokeStyle: { type: "dashed", value: [5, 5] },
    },
];

export default function KonvaStage() {
    const [activeTool, setActiveTool] = useAtom(activeToolAtom);
    const [shapes, setShapes] = useState<Shape[]>(initialRectangles);
    const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);
    const stageRef = useRef<any>(null);
    const shapeRefs = useRef<{ [key: string]: any }>({}); // Store references to all shapes
    const [scale, setScale] = useState(1); // State to handle scale

    const handleWheel = (e: WheelEvent) => {
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

    const selectShape = (e: any, id: string) => {
        if (activeTool !== "Select") {
            return;
        }

        if (e.evt.ctrlKey) {
            setSelectedShapeIds((ids) => [...ids, id]);
        } else {
            setSelectedShapeIds([id]);
        }
    };

    const handleChange = (newAttrs: Shape, id: string) => {
        setShapes((oldShapes) =>
            oldShapes.map((shape) => (shape.id === id ? newAttrs : shape))
        );
    };

    const renderShape = (shape: Shape, index: number) => {
        return (
            <Rectangle
                key={shape.id}
                shape={shape}
                ref={(node: any) => (shapeRefs.current[shape.id] = node)} // Store references
                isSelected={selectedShapeIds.indexOf(shape.id) > -1}
                onSelect={(e: any) => selectShape(e, shape.id)}
                onChange={(newAttrs: Shape) => handleChange(newAttrs, shape.id)}
            />
        );
    };
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

    return (
        <div className="h-screen w-full relative">
            <Tools />
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                ref={stageRef}
                scaleX={scale}
                scaleY={scale}
            >
                <Layer>
                    {shapes.map((shape, index) => renderShape(shape, index))}
                    <CustomTransformer
                        selectedShapeIds={selectedShapeIds}
                        shapeRefs={shapeRefs.current}
                    />
                </Layer>
            </Stage>
            {selectedShapeIds && (
                <ToolBar
                    selectedShapeIds={selectedShapeIds}
                    shapes={shapes.filter((shape) =>
                        selectedShapeIds.includes(shape.id)
                    )}
                    setShapes={setShapes}
                />
            )}
        </div>
    );
}
