import React, { CSSProperties, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Shape } from "../KonvaStage";
import { Button } from "../../../components/ui/button";

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
    itemName: string;
    controlItem: string | number;
    updateItems: any;
    style?: CSSProperties;
    children?: React.ReactNode;
};

const ToolBarItem = ({
    item,
    itemName,
    controlItem,
    updateItems,
    style,
    children,
}: ToolBarItemProps) => {
    return (
        <Button
            key={item}
            className={`w-4 h-4 p-4 flex justify-center items-center rounded-lg ${
                controlItem === item
                    ? "ring-2 ring-white ring-offset-2 ring-offset-black"
                    : ""
            } bg-zinc-800`}
            style={style}
            onClick={() => updateItems({ [itemName]: item })}
        >
            {children}
        </Button>
    );
};

type ToolBarProps = {
    selectedShapeIds: string[];
    shapes: Shape[] | null;
    setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
};
export default function ToolBar({
    selectedShapeIds,
    shapes,

    setShapes,
}: ToolBarProps) {
    const updateItems = (property: any) => {
        setShapes((shapes) => {
            return [
                ...shapes.map((shape) => {
                    if (selectedShapeIds.indexOf(shape.id) > -1) {
                        return { ...shape, ...property };
                    } else {
                        return shape;
                    }
                }),
            ];
        });
    };
    if (!shapes || shapes.length === 0) {
        return;
    }
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
                            itemName="strokeColor"
                            controlItem={shapes[0].strokeColor}
                            updateItems={updateItems}
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
                            itemName="backgroundColor"
                            controlItem={shapes[0].backgroundColor}
                            updateItems={updateItems}
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
                    ].map(({ value }) => (
                        <ToolBarItem
                            key={value}
                            item={value}
                            itemName="strokeWidth"
                            controlItem={shapes[0].strokeWidth}
                            updateItems={updateItems}
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
