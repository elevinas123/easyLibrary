import { useEffect, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import { useAtom } from "jotai";
import { activeToolAtom } from "./konvaAtoms";
import Tools from "./components/Tools";
import ToolBar from "./components/ToolBar";
import Rectangle from "./shapes/Rectangle";
import CustomTransformer from "./shapes/CustomTransformer";
import CircleItem from "./Circle";
import TextItem from "./shapes/TextShape";
import { HtmlObject } from "../../../preprocess/epub/preprocessEpub";
import BookTextItem from "./shapes/BookTextItem";
import BookTextItems from "./shapes/BookTextItem";

export type ShapeType = "Rectangle" | "Circle" | "Arrow" | "Line" | "Text";
const drawingShapes = ["Rectangle", "Circle", "Arrow", "Line", "Text"];

export type Shape =
    | RectangleShape
    | CircleShape
    | TextShape
    | LineShape
    | ArrowShape;

export interface TextShape extends ShapeSkeleton {
    type: "Text";
    text: string;
    fill: string;
    fontSize: number;
    fontFamily: string;
}
export interface CircleShape extends ShapeSkeleton {
    type: "Circle";
    radius: number;
    strokeStyle: StrokeStyle;
    fill: string;
}
export interface RectangleShape extends ShapeSkeleton {
    type: "Rectangle";
    strokeStyle: StrokeStyle;
    fill: string;
}
export interface ArrowShape extends ShapeSkeleton {
    type: "Arrow";
}
export interface LineShape extends ShapeSkeleton {
    type: "Line";
    points: number[];
}

export type StrokeStyle = {
    type: string;
    value: number[];
};

export type ShapeSkeleton = {
    type: ShapeType;
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    strokeColor: string;
    backgroundColor: string;
    strokeWidth: number;
    opacity: number;
};

const initialRectangles: Shape[] = [
    {
        type: "Rectangle",
        id: "rect1",
        x: 50,
        y: 50,
        width: 120,
        height: 80,
        fill: "red",
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
        fill: "blue",
        strokeColor: "green",
        backgroundColor: "lightblue",
        strokeWidth: 3,
        opacity: 0.9,
        strokeStyle: { type: "dashed", value: [5, 5] },
    },
];

type KonvaStageProps = {
    bookElements: (HtmlObject | null)[];
};
export default function KonvaStage({ bookElements }: KonvaStageProps) {
    const [activeTool, setActiveTool] = useAtom(activeToolAtom);
    const [shapes, setShapes] = useState<Shape[]>(initialRectangles);
    const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);
    const [currentShape, setCurrentShape] = useState<Shape | null>(null);
    const stageRef = useRef<any>(null);
    const shapeRefs = useRef<{ [key: string]: any }>({}); // Store references to all shapes
    const [scale, setScale] = useState(1); // State to handle scale
    useEffect(() => {
        console.log("bookElements", bookElements);
    }, [bookElements]);
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
    const handleMouseDown = (e: any) => {
        const pos = e.target.getStage().getPointerPosition();

        if (drawingShapes.indexOf(activeTool) > -1) {
            // If no shape is clicked and we're drawing a new shape
            const id = Date.now().toString();
            switch (activeTool) {
                case "Rectangle":
                    let rectangle: Shape = {
                        type: activeTool,
                        id: id,
                        x: pos.x,
                        y: pos.y,
                        width: 0,
                        height: 0,
                        strokeColor: "green",
                        backgroundColor: "red",
                        strokeWidth: 2.5,
                        strokeStyle: { type: "solid", value: [1000] },
                        opacity: 1,
                        fill: "black",
                    };
                    setCurrentShape(rectangle);
                    break;
                case "Circle":
                    let circle: Shape = {
                        type: activeTool,
                        id: id,
                        x: pos.x,
                        y: pos.y,
                        width: 0,
                        height: 0,
                        strokeColor: "green",
                        backgroundColor: "red",
                        strokeWidth: 2.5,
                        strokeStyle: { type: "solid", value: [1000] },
                        opacity: 1,
                        radius: 2,
                        fill: "black",
                    };
                    setCurrentShape(circle);
                    break;
                case "Text":
                    let text: Shape = {
                        type: activeTool,
                        id: id,
                        x: pos.x,
                        y: pos.y,
                        width: 80,
                        height: 80,
                        strokeColor: "green",
                        backgroundColor: "red",
                        strokeWidth: 2.5,
                        opacity: 1,
                        text: "labas",
                        fontSize: 20,
                        fontFamily: "Arial",
                        fill: "white",
                    };
                    setCurrentShape(text);
            }
        }
    };

    const handleMouseMove = (e: any) => {
        if (!currentShape) return;

        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        let updatedShape: Shape = { ...currentShape };

        switch (updatedShape.type) {
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

    const renderShape = (shape: Shape) => {
        switch (shape.type) {
            case "Rectangle":
                return (
                    <Rectangle
                        key={shape.id}
                        shape={shape}
                        ref={(node: any) =>
                            (shapeRefs.current[shape.id] = node)
                        } // Store references
                        isSelected={selectedShapeIds.indexOf(shape.id) > -1}
                        onSelect={(e: any) => selectShape(e, shape.id)}
                        onChange={(newAttrs: Shape) =>
                            handleChange(newAttrs, shape.id)
                        }
                    />
                );
            case "Circle":
                return (
                    <CircleItem
                        key={shape.id}
                        shape={shape}
                        ref={(node: any) =>
                            (shapeRefs.current[shape.id] = node)
                        } // Store references
                        isSelected={selectedShapeIds.indexOf(shape.id) > -1}
                        onSelect={(e: any) => selectShape(e, shape.id)}
                        onChange={(newAttrs: Shape) =>
                            handleChange(newAttrs, shape.id)
                        }
                    />
                );
            case "Text":
                return (
                    <TextItem
                        key={shape.id}
                        shape={shape}
                        ref={(node: any) =>
                            (shapeRefs.current[shape.id] = node)
                        } // Store references
                        isSelected={selectedShapeIds.indexOf(shape.id) > -1}
                        onSelect={(e: any) => selectShape(e, shape.id)}
                        onChange={(newAttrs: Shape) =>
                            handleChange(newAttrs, shape.id)
                        }
                    />
                );
        }
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
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <Layer>
                    {shapes.map((shape) => renderShape(shape))}
                    <CustomTransformer
                        selectedShapeIds={selectedShapeIds}
                        shapeRefs={shapeRefs.current}
                    />
                    <CustomTransformer
                        selectedShapeIds={selectedShapeIds}
                        shapeRefs={shapeRefs.current}
                    />
                </Layer>
                <BookTextItems
                    bookElements={bookElements}
                />
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
