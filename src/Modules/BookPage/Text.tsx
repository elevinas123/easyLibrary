import React, { useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/types/data/transform";
import { FONT_FAMILY } from "@excalidraw/excalidraw";
import { AppState, BinaryFiles, ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
type TextProps = {
    text: string;
    fontSize: number;
};



export default function ExcalidrawText({ text, fontSize }: TextProps) {
    const [elements, setElements] = useState<ExcalidrawElementSkeleton[]>([]);
    const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
    const wordsInLine = 5;
    const lineHeight = 30;

    useEffect(() => {
        setElements(() => {
            let textColumns: string[] = [];
            const splitText = text.split(" ");
            let currentColumn: string[] = [];

            splitText.forEach((word, index) => {
                currentColumn.push(word);
                // Check if the current column is full or if it's the last word
                if (
                    currentColumn.length === wordsInLine ||
                    index === splitText.length - 1
                ) {
                    textColumns.push(currentColumn.join(" "));
                    currentColumn = []; // Reset for the next column
                }
            });
            return textColumns.map((column, index) => ({
                text: column,
                x: 500,
                y: index * lineHeight + 200,
                fontSize: fontSize,
                font: "normal",
                type: "text",
            }));
        });
    }, [text, fontSize]);
    

    const handleSceneChange = (elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
        console.log("elements", elements)
    }

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <Excalidraw
                excalidrawAPI={(api) => setExcalidrawAPI(api)}
                onChange={handleSceneChange}
            />
        </div>
    );
}
