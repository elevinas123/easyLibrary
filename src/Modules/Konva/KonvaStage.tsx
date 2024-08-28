import { useState, useRef } from "react";
import {
    Stage,
    Layer,
    Rect,
    Circle,
    Line,
    Text,
    Transformer,
} from "react-konva";
import Konva from "konva";

const DrawingBoard = () => {
    const [tool, setTool] = useState("pen");
    const [shapes, setShapes] = useState([]);
    const [selectedId, selectShape] = useState(null);
    const stageRef = useRef(null);
    const layerRef = useRef(null);
    const trRef = useRef(null);
    const isDrawing = useRef(false);

    const handleMouseDown = (e) => {
        if (tool !== "pen") return;
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        const newLine = {
            id: Konva.Util.getRandomColor(),
            points: [pos.x, pos.y],
            tool,
        };
        setShapes([...shapes, newLine]);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current || tool !== "pen") return;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        const lastLine = shapes[shapes.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);

        shapes.splice(shapes.length - 1, 1, lastLine);
        setShapes([...shapes]);
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const addRectangle = () => {
        const rect = {
            id: Konva.Util.getRandomColor(),
            x: (Math.random() * window.innerWidth) / 2,
            y: (Math.random() * window.innerHeight) / 2,
            width: 100,
            height: 100,
            fill: "green",
            type: "rect",
        };
        setShapes([...shapes, rect]);
    };

    const addCircle = () => {
        const circle = {
            id: Konva.Util.getRandomColor(),
            x: (Math.random() * window.innerWidth) / 2,
            y: (Math.random() * window.innerHeight) / 2,
            radius: 50,
            fill: "blue",
            type: "circle",
        };
        setShapes([...shapes, circle]);
    };

    const handleSelect = (id) => {
        selectShape(id);
        const shape = layerRef.current.findOne(`#${id}`);
        trRef.current.nodes([shape]);
        trRef.current.getLayer().batchDraw();
    };

    const handleDragMove = (e) => {
        const id = e.target.id();
        const newShapes = shapes.slice();
        const shape = newShapes.find((s) => s.id === id);
        shape.x = e.target.x();
        shape.y = e.target.y();
        setShapes(newShapes);
    };

    return (
        <div>
            <div>
                <button onClick={() => setTool("pen")}>Pen</button>
                <button onClick={addRectangle}>Rectangle</button>
                <button onClick={addCircle}>Circle</button>
                <button onClick={() => setTool("select")}>Select</button>
                {/* Add more tool buttons here */}
            </div>
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                ref={stageRef}
            >
                <Layer ref={layerRef}>
                    {shapes.map((shape, i) => {
                        if (shape.tool === "pen") {
                            return (
                                <Line
                                    key={i}
                                    id={shape.id}
                                    points={shape.points}
                                    stroke="black"
                                    strokeWidth={2}
                                    tension={0.5}
                                    lineCap="round"
                                    lineJoin="round"
                                />
                            );
                        } else if (shape.type === "rect") {
                            return (
                                <Rect
                                    key={i}
                                    id={shape.id}
                                    x={shape.x}
                                    y={shape.y}
                                    width={shape.width}
                                    height={shape.height}
                                    fill={shape.fill}
                                    draggable
                                    onClick={() => handleSelect(shape.id)}
                                    onDragMove={handleDragMove}
                                />
                            );
                        } else if (shape.type === "circle") {
                            return (
                                <Circle
                                    key={i}
                                    id={shape.id}
                                    x={shape.x}
                                    y={shape.y}
                                    radius={shape.radius}
                                    fill={shape.fill}
                                    draggable
                                    onClick={() => handleSelect(shape.id)}
                                    onDragMove={handleDragMove}
                                />
                            );
                        }
                        return null;
                    })}
                    <Transformer ref={trRef} />
                </Layer>
            </Stage>
        </div>
    );
};

export default DrawingBoard;
