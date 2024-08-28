import React, { useState, useRef } from "react";
import { Stage, Layer, Line, Rect, Circle, Transformer } from "react-konva";

type Tool = "brush" | "rect" | "circle" | "move";

type Point = { x: number; y: number };

type LineData = {
    id: string;
    points: number[];
    color: string;
};

type RectData = {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
};

type CircleData = {
    id: string;
    x: number;
    y: number;
    radius: number;
    color: string;
};

export default function KonvaStage() {
    const [tool, setTool] = useState<Tool>("brush");
    const [lines, setLines] = useState<LineData[]>([]);
    const [rects, setRects] = useState<RectData[]>([]);
    const [circles, setCircles] = useState<CircleData[]>([]);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [brushColor, setBrushColor] = useState<string>("black");
    const [startPos, setStartPos] = useState<Point | null>(null);
    const [selectedShape, setSelectedShape] = useState<string | null>(null);
    const transformerRef = useRef<any>(null);
    const layerRef = useRef<any>(null);

    const handleMouseDown = (e: any) => {
        const pos = e.target.getStage().getPointerPosition();
        if (tool === "brush") {
            setIsDrawing(true);
            const newLine: LineData = {
                id: `${lines.length + 1}`,
                points: [pos.x, pos.y],
                color: brushColor,
            };
            setLines([...lines, newLine]);
        } else if (tool === "rect" || tool === "circle") {
            setStartPos(pos);
            if (tool === "rect") {
                const newRect: RectData = {
                    id: `${rects.length + 1}`,
                    x: pos.x,
                    y: pos.y,
                    width: 0,
                    height: 0,
                    color: brushColor,
                };
                setRects([...rects, newRect]);
            } else if (tool === "circle") {
                const newCircle: CircleData = {
                    id: `${circles.length + 1}`,
                    x: pos.x,
                    y: pos.y,
                    radius: 0,
                    color: brushColor,
                };
                setCircles([...circles, newCircle]);
            }
        }
    };

    const handleMouseMove = (e: any) => {
        const pos = e.target.getStage().getPointerPosition();
        if (!isDrawing && !startPos) return;

        if (tool === "brush" && isDrawing) {
            const lastLine = lines[lines.length - 1];
            lastLine.points = lastLine.points.concat([pos.x, pos.y]);
            setLines(lines.slice(0, -1).concat(lastLine));
        } else if (tool === "rect" && startPos) {
            const lastRect = rects[rects.length - 1];
            lastRect.width = pos.x - startPos.x;
            lastRect.height = pos.y - startPos.y;
            setRects(rects.slice(0, -1).concat(lastRect));
        } else if (tool === "circle" && startPos) {
            const lastCircle = circles[circles.length - 1];
            lastCircle.radius = Math.sqrt(
                Math.pow(pos.x - startPos.x, 2) +
                    Math.pow(pos.y - startPos.y, 2)
            );
            setCircles(circles.slice(0, -1).concat(lastCircle));
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        setStartPos(null);
    };

    const handleSelect = (id: string) => {
        setSelectedShape(id);
        const stage = transformerRef.current.getStage();
        const selectedNode = stage.findOne(`#${id}`);
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
    };

    const handleDragMove = (e: any, id: string, type: "rect" | "circle") => {
        const pos = e.target.position();
        if (type === "rect") {
            const updatedRects = rects.map((rect) =>
                rect.id === id
                    ? {
                          ...rect,
                          x: pos.x,
                          y: pos.y,
                      }
                    : rect
            );
            setRects(updatedRects);
        } else if (type === "circle") {
            const updatedCircles = circles.map((circle) =>
                circle.id === id
                    ? {
                          ...circle,
                          x: pos.x,
                          y: pos.y,
                      }
                    : circle
            );
            setCircles(updatedCircles);
        }
    };

    const handleTransform = (e: any, id: string, type: "rect" | "circle") => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        const pos = node.position();

        if (type === "rect") {
            const updatedRects = rects.map((rect) =>
                rect.id === id
                    ? {
                          ...rect,
                          x: pos.x,
                          y: pos.y,
                          width: Math.max(5, rect.width * scaleX),
                          height: Math.max(5, rect.height * scaleY),
                      }
                    : rect
            );
            setRects(updatedRects);
            node.scaleX(1);
            node.scaleY(1);
        } else if (type === "circle") {
            const updatedCircles = circles.map((circle) =>
                circle.id === id
                    ? {
                          ...circle,
                          x: pos.x,
                          y: pos.y,
                          radius: Math.max(
                              5,
                              circle.radius * Math.max(scaleX, scaleY)
                          ),
                      }
                    : circle
            );
            setCircles(updatedCircles);
            node.scaleX(1);
            node.scaleY(1);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: "10px" }}>
                <button className="bg-zinc-800 border border-zinc-600 p-2 mt-10" onClick={() => setTool("brush")}>Brush</button>
                <button className="bg-zinc-800 border border-zinc-600 p-2 mt-10" onClick={() => setTool("rect")}>Rectangle</button>
                <button className="bg-zinc-800 border border-zinc-600 p-2 mt-10" onClick={() => setTool("circle")}>Circle</button>
                <button className="bg-zinc-800 border border-zinc-600 p-2 mt-10" onClick={() => setTool("move")}>Move</button>
                <button className="bg-zinc-800 border border-zinc-600 p-2 mt-10" onClick={() => setBrushColor("black")}>Black</button>
                <button className="bg-zinc-800 border border-zinc-600 p-2 mt-10" onClick={() => setBrushColor("red")}>Red</button>
                <button className="bg-zinc-800 border border-zinc-600 p-2 mt-10" onClick={() => setBrushColor("blue")}>Blue</button>
                <button className="bg-zinc-800 border border-zinc-600 p-2 mt-10" onClick={() => setBrushColor("green")}>Green</button>
            </div>
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <Layer ref={layerRef}>
                    {lines.map((line) => (
                        <Line
                            key={line.id}
                            id={line.id}
                            points={line.points}
                            stroke={line.color}
                            strokeWidth={8}
                            lineCap="round"
                            lineJoin="round"
                            draggable={tool === "move"}
                            onClick={() => handleSelect(line.id)}
                        />
                    ))}
                    {rects.map((rect) => (
                        <Rect
                            key={rect.id}
                            id={rect.id}
                            x={rect.x}
                            y={rect.y}
                            width={rect.width}
                            height={rect.height}
                            stroke={rect.color}
                            strokeWidth={2}
                            draggable={tool === "move"}
                            onClick={() => handleSelect(rect.id)}
                            onDragMove={(e) =>
                                handleDragMove(e, rect.id, "rect")
                            }
                            onTransformEnd={(e) =>
                                handleTransform(e, rect.id, "rect")
                            }
                        />
                    ))}
                    {circles.map((circle) => (
                        <Circle
                            key={circle.id}
                            id={circle.id}
                            x={circle.x}
                            y={circle.y}
                            radius={circle.radius}
                            stroke={circle.color}
                            strokeWidth={2}
                            draggable={tool === "move"}
                            onClick={() => handleSelect(circle.id)}
                            onDragMove={(e) =>
                                handleDragMove(e, circle.id, "circle")
                            }
                            onTransformEnd={(e) =>
                                handleTransform(e, circle.id, "circle")
                            }
                        />
                    ))}
                    <Transformer ref={transformerRef} />
                </Layer>
            </Stage>
        </div>
    );
}
