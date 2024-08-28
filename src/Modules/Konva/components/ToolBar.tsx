import React, { useState } from "react";
import {
    FaUndo,
    FaRedo,
    FaTrash,
    FaLink,
    FaClone,
    FaArrowUp,
    FaArrowDown,
} from "react-icons/fa";

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

export default function ToolBar() {
    const [strokeColor, setStrokeColor] = useState("#f08c00");
    const [backgroundColor, setBackgroundColor] = useState("transparent");
    const [strokeWidth, setStrokeWidth] = useState("2.5");
    const [strokeStyle, setStrokeStyle] = useState("solid");
    const [sloppiness, setSloppiness] = useState("architect");
    const [edges, setEdges] = useState("round");
    const [opacity, setOpacity] = useState(100);

    return (
        <div className=" absolute left-0 z-50 top-36 flex flex-col space-y-4 p-4  bg-gray-900 rounded shadow-lg max-w-xs">
            <div>
                <h3 className="text-sm font-semibold">Stroke</h3>
                <div className="flex space-x-2 mt-2">
                    {colors.slice(0, 5).map((color) => (
                        <button
                            key={color}
                            className={`w-8 h-8 rounded-full border-2 ${
                                strokeColor === color
                                    ? "border-black"
                                    : "border-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setStrokeColor(color)}
                        ></button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold">Background</h3>
                <div className="flex space-x-2 mt-2">
                    {["transparent", ...colors.slice(5)].map((color) => (
                        <button
                            key={color}
                            className={`w-8 h-8 rounded-full border-2 ${
                                backgroundColor === color
                                    ? "border-black"
                                    : "border-transparent"
                            }`}
                            style={{
                                backgroundColor:
                                    color === "transparent" ? "white" : color,
                            }}
                            onClick={() => setBackgroundColor(color)}
                        ></button>
                    ))}
                </div>
            </div>

            <fieldset>
                <legend className="text-sm font-semibold">Stroke width</legend>
                <div className="flex space-x-4 mt-2">
                    {[
                        { title: "Thin", value: "1.25" },
                        { title: "Bold", value: "2.5" },
                        { title: "Extra bold", value: "3.75" },
                    ].map(({ title, value }) => (
                        <label key={value} title={title}>
                            <input
                                type="radio"
                                name="stroke-width"
                                checked={strokeWidth === value}
                                onChange={() => setStrokeWidth(value)}
                            />
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
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset>
                <legend className="text-sm font-semibold">Stroke style</legend>
                <div className="flex space-x-4 mt-2">
                    {[
                        { title: "Solid", value: "solid" },
                        { title: "Dashed", value: "dashed" },
                        { title: "Dotted", value: "dotted" },
                    ].map(({ title, value }) => (
                        <label key={value} title={title}>
                            <input
                                type="radio"
                                name="strokeStyle"
                                checked={strokeStyle === value}
                                onChange={() => setStrokeStyle(value)}
                            />
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
                                {value === "solid" && <path d="M5 12h14" />}
                                {value === "dashed" && (
                                    <>
                                        <path d="M5 12h2" />
                                        <path d="M11 12h2" />
                                        <path d="M17 12h2" />
                                    </>
                                )}
                                {value === "dotted" && (
                                    <>
                                        <path d="M5 12v.01" />
                                        <path d="M9 12v.01" />
                                        <path d="M13 12v.01" />
                                        <path d="M17 12v.01" />
                                    </>
                                )}
                            </svg>
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset>
                <legend className="text-sm font-semibold">Sloppiness</legend>
                <div className="flex space-x-4 mt-2">
                    {["architect", "artist", "cartoonist"].map((value) => (
                        <label
                            key={value}
                            title={
                                value.charAt(0).toUpperCase() + value.slice(1)
                            }
                        >
                            <input
                                type="radio"
                                name="sloppiness"
                                checked={sloppiness === value}
                                onChange={() => setSloppiness(value)}
                            />
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
                                <path
                                    d="M2.5 12.5c1.5-0.5 5-3 7.5-4s0 2 1 2 5-2 5-2"
                                    strokeWidth="1.25"
                                />
                            </svg>
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset>
                <legend className="text-sm font-semibold">Edges</legend>
                <div className="flex space-x-4 mt-2">
                    {["sharp", "round"].map((value) => (
                        <label
                            key={value}
                            title={
                                value.charAt(0).toUpperCase() + value.slice(1)
                            }
                        >
                            <input
                                type="radio"
                                name="edges"
                                checked={edges === value}
                                onChange={() => setEdges(value)}
                            />
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
                        </label>
                    ))}
                </div>
            </fieldset>

            <label className="control-label flex items-center space-x-2">
                <span>Opacity</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                />
            </label>

            <fieldset>
                <legend className="text-sm font-semibold">Layers</legend>
                <div className="flex space-x-2 mt-2">
                    <button
                        type="button"
                        className="zIndexButton"
                        title="Send to back"
                    >
                        <FaArrowDown className="transform rotate-180" />
                    </button>
                    <button
                        type="button"
                        className="zIndexButton"
                        title="Send backward"
                    >
                        <FaArrowDown />
                    </button>
                    <button
                        type="button"
                        className="zIndexButton"
                        title="Bring forward"
                    >
                        <FaArrowUp />
                    </button>
                    <button
                        type="button"
                        className="zIndexButton"
                        title="Bring to front"
                    >
                        <FaArrowUp className="transform rotate-180" />
                    </button>
                </div>
            </fieldset>

            <fieldset>
                <legend className="text-sm font-semibold">Actions</legend>
                <div className="flex space-x-2 mt-2">
                    <button type="button" title="Duplicate">
                        <FaClone />
                    </button>
                    <button type="button" title="Delete">
                        <FaTrash />
                    </button>
                    <button type="button" title="Link">
                        <FaLink />
                    </button>
                </div>
            </fieldset>
        </div>
    );
}
