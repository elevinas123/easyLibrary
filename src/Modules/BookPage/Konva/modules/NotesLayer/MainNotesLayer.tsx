import { useAtom } from "jotai";
import { Layer, Arrow } from "react-konva";
import {
    ForwardedRef,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { activeToolAtom } from "../../konvaAtoms";
import { KonvaEventObject } from "konva/lib/Node";

type MainNotesLayerProps = {
    // Define your prop types here
};

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


type ArrowItem = {
    points: number[];
};
export type MainNotesLayerRef = {
    handleMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseUp: () => void;
};

function MainNotesLayer(
    {}: MainNotesLayerProps,
    ref: ForwardedRef<MainNotesLayerRef>
) {
    const [activeTool] = useAtom(activeToolAtom);
    const [arrows, setArrows] = useState<ArrowItem[]>([]); // Array to store arrows
    const [newArrow, setNewArrow] = useState<ArrowItem | null>(null); // Currently drawing arrow
    const [shapes, setShapes] = useState<Shape[]>(initialRectangles);
    const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);
    const [currentShape, setCurrentShape] = useState<Shape | null>(null);
    const shapeRefs = useRef<{ [key: string]: any }>({}); // Store references to all shapes

    useEffect(() => {
        console.log("down");
    }, []);

    useImperativeHandle(
        ref,
        () => ({
            handleMouseDown(e: KonvaEventObject<MouseEvent>) {
                console.log("down", e);
                if (activeTool === "Arrow") {
                    // Get the start position of the arrow
                    const pos = e.target?.getStage()?.getPointerPosition();
                    if (!pos) return;
                    setNewArrow({
                        points: [pos.x, pos.y, pos.x, pos.y], // Initial start and end points are the same
                    });
                }
            },

            handleMouseMove(e: KonvaEventObject<MouseEvent>) {
                if (!newArrow || activeTool !== "Arrow") return;

                // Update the end position of the arrow as the mouse moves
                const pos = e.target?.getStage()?.getPointerPosition();
                if (!pos) return;
                const updatedArrow = {
                    ...newArrow,
                    points: [
                        newArrow.points[0],
                        newArrow.points[1],
                        pos.x,
                        pos.y,
                    ],
                };
                setNewArrow(updatedArrow); // Update the arrow being drawn
            },

            handleMouseUp() {
                if (!newArrow) return;

                // Finalize the arrow when the mouse is released
                setArrows((prevArrows) => [...prevArrows, newArrow]);
                setNewArrow(null); // Reset current arrow
            },
        }),
        [setNewArrow, setArrows, newArrow, activeTool]
    );

    return (
        <Layer>
            {/* Render finalized arrows */}
            {arrows.map((arrow, i) => (
                <Arrow
                    key={i}
                    points={arrow.points}
                    stroke="black"
                    fill="black"
                    pointerLength={10}
                    pointerWidth={10}
                    lineCap="round"
                    lineJoin="round"
                />
            ))}

            {/* Render the arrow currently being drawn */}
            {newArrow && (
                <Arrow
                    points={newArrow.points}
                    stroke="black"
                    fill="black"
                    pointerLength={10}
                    pointerWidth={10}
                    lineCap="round"
                    lineJoin="round"
                />
            )}
        </Layer>
    );
}

export default forwardRef(MainNotesLayer);
