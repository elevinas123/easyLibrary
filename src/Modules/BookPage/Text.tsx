import React, { useEffect, useRef, useState } from "react";
import { Excalidraw, convertToExcalidrawElements } from "@excalidraw/excalidraw";
import { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/types/data/transform";

import { AppState, BinaryFileData, BinaryFiles, DataURL, ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { v4 as uuidv4 } from "uuid";
import { preprocessText } from "./functions/preprocessText";
import { textElementDefault } from "./elementDefaults/createTextElement";
type TextProps = {
    text: string;
    fontSize: number;
};


function toDataURL(url: string): DataURL {
    return url as unknown as DataURL; // Cast string to DataURL, assuming it's formatted correctly
}

type ImageConfig = {

}

export default function ExcalidrawText({ text, fontSize }: TextProps) {
    const [elements, setElements] = useState<string[]>([]);
    const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
    const wordsInLine = 5;
    const maxCharactersPerLine = 90
    const lineHeight = 30;

  
    useEffect(() => {
        setElements(preprocessText(text, maxCharactersPerLine));
    }, [text, fontSize]);
    useEffect(() => {
        excalidrawAPI?.updateScene({
            elements: elements.map((item, index) => {
                let defaultTextElement = { ...textElementDefault }
                defaultTextElement.id = uuidv4()
                defaultTextElement.x = 500
                defaultTextElement.y = index * 30+ 20
                defaultTextElement.text = item
                defaultTextElement.fontFamily = 1;
                return defaultTextElement
            })
        })
        console.log("elementsNew", elements)
    }, [elements])

  
    

    const handleSceneChange = (elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
        console.log("elements", elements)
        //console.log("files", excalidrawAPI?.getFiles())
    }

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <Excalidraw
                excalidrawAPI={(api) => setExcalidrawAPI(api)}
                onChange={handleSceneChange}
                theme="dark"
            />
        </div>
    );
}
