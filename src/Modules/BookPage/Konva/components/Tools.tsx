import React, { useState } from "react";
import {
    FaHandPaper,
    FaSquare,
    FaCircle,
    FaDrawPolygon,
    FaArrowRight,
    FaPalette,
    FaFont,
    FaImage,
    FaEraser,
    FaSlash,
} from "react-icons/fa";
import { FiMousePointer } from "react-icons/fi";
import { BiRectangle } from "react-icons/bi";

import { CgShapeRhombus } from "react-icons/cg";
import { useAtom } from "jotai";
import { activeToolAtom } from "../konvaAtoms";
import { Button } from "../../../../components/ui/button";

export type DrawingToolNames =
    | "Pan"
    | "Select"
    | "Rectangle"
    | "Rhombus"
    | "Circle"
    | "Arrow"
    | "Line"
    | "Color Picker"
    | "Text"
    | "Image"
    | "Eraser";

type DrawingTools = {
    name: DrawingToolNames;
    icon: JSX.Element;
};

export default function Tools() {
    // Define the active tool state
    const [activeTool, setActiveTool] = useAtom(activeToolAtom);

    // Define functions to handle tool activation
    const activateTool = (tool: DrawingToolNames) => {
        setActiveTool(tool);
        console.log(`${tool} tool activated`);
    };

    const tools: DrawingTools[] = [
        { name: "Pan", icon: <FaHandPaper /> },
        { name: "Select", icon: <FiMousePointer /> },
        { name: "Rectangle", icon: <BiRectangle /> },
        { name: "Rhombus", icon: <CgShapeRhombus /> },
        { name: "Circle", icon: <FaCircle /> },
        { name: "Arrow", icon: <FaArrowRight /> },
        { name: "Line", icon: <FaSlash /> },
        { name: "Color Picker", icon: <FaPalette /> },
        { name: "Text", icon: <FaFont /> },
        { name: "Image", icon: <FaImage /> },
        { name: "Eraser", icon: <FaEraser /> },
    ];

    return (
        <div className=" z-50 absolute top-10 left-1/2 transform bg-zinc-900 -translate-x-1/2 flex flex-row  items-center  p-2 rounded-lg shadow-lg space-x-2">
            {tools.map((tool) => (
                <Button
                    size="icon"
                    key={tool.name}
                    className={`hover:cursor-pointer flex justify-center items-center w-10 h-10  rounded-lg  bg-gray-900  text-white hover:bg-zinc-800
                        ${
                            activeTool === tool.name &&
                            "bg-cyan-600 hover:bg-cyan-800"
                        }
                    `}
                    onClick={() => activateTool(tool.name)}
                    title={tool.name}
                >
                    {tool.icon}
                </Button>
            ))}
        </div>
    );
}
