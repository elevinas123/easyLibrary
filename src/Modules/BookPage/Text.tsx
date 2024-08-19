import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Text, Stage as StageType } from "react-konva";
import Konva from "konva";

type TextProps = {
    text: string;
    fontSize: number;
};

type TextElement = {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    fill: string;
    draggable: boolean;
};

export default function KonvaText({ text, fontSize }: TextProps) {
    const stageRef = useRef<typeof StageType | null>(null);
    const [textElements, setTextElements] = useState<TextElement[]>([]);

    useEffect(() => {
        // Split the text into lines
        const lines = text.split("\n");

        // Generate new text elements for each line
        const newTextElements = lines.map((line, index) => ({
            id: `text-${index}-${Date.now()}`,
            text: line,
            x: 100, // X position
            y: 50 + index * (fontSize + 10), // Y position, adjusted for each line
            fontSize: fontSize,
            fontFamily: "Arial",
            fill: "rgb(250 250 250)", // Text color
            draggable: true,
        }));

        setTextElements(newTextElements);
    }, [text, fontSize]);

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">
            {/* Header */}
            <div className="h-12 p-4 flex items-center justify-center border-b ">
                s
            </div>
            {/* Scrollable Content */}
            <div className="flex justify-center w-full overflow-y-auto flex-1">
                <div
                    style={{ fontSize: `${fontSize}px`, lineHeight: "1.6" }}
                    className="flex flex-col w-full max-w-3xl break-words  p-6 rounded-lg shadow-md"
                >
                    {/* Konva Stage */}
                    <Stage
                        width={window.innerWidth}
                        height={window.innerHeight}
                        ref={stageRef !== null && stageRef}
                        fill={"#fffff"}
                    >
                        <Layer>
                            {textElements.map((elem) => (
                                <Text
                                    key={elem.id}
                                    text={elem.text}
                                    x={elem.x}
                                    y={elem.y}
                                    fontSize={elem.fontSize}
                                    fontFamily={elem.fontFamily}
                                    fill={elem.fill}
                                    draggable={elem.draggable}
                                    onMouseEnter={(e) => {
                                        const container = e.target
                                            .getStage()
                                            ?.container();
                                        if (container) {
                                            container.style.cursor = "pointer";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        const container = e.target
                                            .getStage()
                                            ?.container();
                                        if (container) {
                                            container.style.cursor = "default";
                                        }
                                    }}
                                />
                            ))}
                        </Layer>
                    </Stage>
                </div>
            </div>
        </div>
    );
}
