import React, { CSSProperties, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Shape } from "../KonvaStage";

const colors = [
    "#1e1e1e",
    "#e03131",
    "#2f9e44",
    "#1971c2",
    "#f08c00",
    "#ffc9c9",
    "#b2f2bb",
    "#a5d8ff",
    "#ffec99",
];

type ToolBarItemProps = {
    item: string | number;
    controlItem: string | number;
    changeFunction: any;
    style?: CSSProperties;
    children?: React.ReactNode;
};

const ToolBarItem = ({
    item,
    controlItem,
    changeFunction,
    style,
    children,
}: ToolBarItemProps) => {
    return (
        <button
            key={item}
            className={`w-7 h-7 justify-center items-center flex rounded-lg border-2 bg-zinc-800 ${
                controlItem === item
                    ? "border-zinc-500 border bg-neutral-800"
                    : "border-transparent"
            }`}
            style={style}
            onClick={() => changeFunction(item)}
        >
            {children}
        </button>
    );
};

type ToolBarProps = {
    shapeId: string;
    setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
};
export default function ToolBar({ shapeId, setShapes }: ToolBarProps) {
    const [strokeColor, setStrokeColor] = useState("#f08c00");
    const [backgroundColor, setBackgroundColor] = useState("transparent");
    const [strokeWidth, setStrokeWidth] = useState(2.5);
    const [strokeStyle, setStrokeStyle] = useState({
        type: "solid",
        value: [1000],
    });
    const [edges, setEdges] = useState("round");
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        setShapes((prevShapes) =>
            prevShapes.map((shape) =>
                shape.id === shapeId
                    ? {
                          ...shape,
                          strokeColor,
                          backgroundColor,
                          strokeWidth,
                          strokeStyle,
                          edges,
                          opacity,
                      }
                    : shape
            )
        );
    }, [
        strokeColor,
        backgroundColor,
        strokeWidth,
        strokeStyle,
        edges,
        opacity,
        shapeId,
    ]);
    return (
        <div className="absolute left-0 z-50 top-36 flex flex-col space-y-4 p-4 bg-zinc-900 border border-zinc-500 rounded shadow-lg max-w-xs">
            {/* Stroke Color */}
            <div>
                <h3 className="text-sm font-semibold">Stroke</h3>
                <div className="flex space-x-2 mt-2">
                    {colors.slice(0, 5).map((color) => (
                        <ToolBarItem
                            key={color}
                            item={color}
                            controlItem={strokeColor}
                            changeFunction={setStrokeColor}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>

            {/* Background Color */}
            <div>
                <h3 className="text-xs font-semibold">Background</h3>
                <div className="flex space-x-2 mt-2">
                    {["transparent", ...colors.slice(5)].map((color) => (
                        <ToolBarItem
                            key={color}
                            item={color}
                            controlItem={backgroundColor}
                            changeFunction={setBackgroundColor}
                            style={{
                                backgroundColor:
                                    color === "transparent" ? "white" : color,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Stroke Width */}
            <fieldset>
                <legend className="text-xs font-semibold">Stroke width</legend>
                <div className="flex space-x-4 mt-2">
                    {[
                        { title: "Thin", value: 1.25 },
                        { title: "Bold", value: 2.5 },
                        { title: "Extra bold", value: 3.75 },
                    ].map(({ title, value }) => (
                        <ToolBarItem
                            key={value}
                            item={value}
                            controlItem={strokeWidth}
                            changeFunction={setStrokeWidth}
                        >
                            <svg
                                aria-hidden="true"
                                focusable="false"
                                role="img"
                                viewBox="0 0 20 20"
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 10h10" strokeWidth={value} />
                            </svg>
                        </ToolBarItem>
                    ))}
                </div>
            </fieldset>

            {/* Stroke Style */}
            <fieldset>
                <legend className="text-xs font-semibold">Stroke width</legend>
                <div className="flex space-x-4 mt-2">
                    {[
                        { type: "solid", value: [1000] },
                        { type: "dashed", value: [2, 2] },
                        { type: "dotted", value: [2, 4] },
                    ].map(({ type, value }) => (
                        <button
                            key={type}
                            className={`w-7 h-7 justify-center items-center flex rounded-lg border-2 bg-zinc-800 ${
                                type === strokeStyle.type
                                    ? "border-zinc-500 border bg-neutral-800"
                                    : "border-transparent"
                            }`}
                            onClick={() => setStrokeStyle({ type, value })}
                        >
                            <svg
                                aria-hidden="true"
                                focusable="false"
                                role="img"
                                viewBox="0 0 24 24"
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                            >
                                {type === "solid" && <path d="M5 12h14" />}
                                {type === "dashed" && (
                                    <>
                                        <path d="M5 12h2" />
                                        <path d="M11 12h2" />
                                        <path d="M17 12h2" />
                                    </>
                                )}
                                {type === "dotted" && (
                                    <>
                                        <path d="M5 12v.01" />
                                        <path d="M9 12v.01" />
                                        <path d="M13 12v.01" />
                                        <path d="M17 12v.01" />
                                    </>
                                )}
                            </svg>
                        </button>
                    ))}
                </div>
            </fieldset>

            {/* Edges */}
            <fieldset>
                <legend className="text-xs font-semibold">Edges</legend>
                <div className="flex space-x-4 mt-2">
                    {["sharp", "round"].map((value) => (
                        <ToolBarItem
                            key={value}
                            item={value}
                            controlItem={edges}
                            changeFunction={setEdges}
                        >
                            <svg
                                aria-hidden="true"
                                focusable="false"
                                role="img"
                                viewBox="0 0 20 20"
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                            >
                                {value === "sharp" ? (
                                    <path d="M5 5h10v10H5z" />
                                ) : (
                                    <path d="M5 5h10v10H5z" rx="2" />
                                )}
                            </svg>
                        </ToolBarItem>
                    ))}
                </div>
            </fieldset>

            {/* Opacity */}
            <label className="control-label flex flex-col space-x-2">
                <span className="text-xs ">Opacity</span>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                />
            </label>

            {/* Layers */}

            {/* Actions */}
            <fieldset>
                <legend className="text-sm font-semibold">Actions</legend>
                <div className="flex space-x-2 mt-2">
                    <button
                        className={`w-7 h-7  p-1.5 justify-center items-center flex rounded-lg bg-zinc-700 
                           
                        `}
                    >
                        <FaTrash />
                    </button>
                </div>
            </fieldset>
        </div>
    );
}
