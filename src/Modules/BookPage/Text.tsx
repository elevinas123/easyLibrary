import React, { useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/types/data/transform";
import { FONT_FAMILY } from "@excalidraw/excalidraw";
import { AppState, BinaryFileData, BinaryFiles, DataURL, ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
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
    const [elements, setElements] = useState<ExcalidrawElementSkeleton[]>([]);
    const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
    const wordsInLine = 5;
    const lineHeight = 30;

    const addFileToCanvas = async (file, imageConfig) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const dataURL = e.target.result;
            if (!dataURL) {
                throw new Error("Failed to load image");
            }

            const fileData: BinaryFileData = {
                mimeType: file.type, // Assume file.type returns a valid MIME type string
                id: file.name, // Use the file's name as the ID
                dataURL: toDataURL(dataURL as string), // Cast to string and brand as DataURL
                created: Date.now(),
                // lastRetrieved is optional, add it if needed
            };

            excalidrawAPI?.addFiles([fileData]); // Assuming excalidrawAPI is correctly typed to accept BinaryFileData[]
            addImageElement(file.name); // Pass along the dataURL to be used in image element creation
        };
        reader.readAsDataURL(file); // Read the file as a DataURL directly
    };


    const addImageElement = (fileId, imageConfig) => {
        const 
        const imageElement: ExcalidrawElement = {
            id: "vmjNL5jqCJPwBieun0GHp",
            type: "image",
            x: 87.13124999999997,
            y: 146,
            width: 740.8000000000001,
            height: 463,
            angle: 0,
            strokeColor: "transparent",
            backgroundColor: "transparent",
            fillStyle: "solid",
            strokeWidth: 2,
            strokeStyle: "solid",
            roughness: 1,
            opacity: 100,
            groupIds: [],
            frameId: null,
            roundness: null,
            seed: 1545706811,
            version: 4,
            versionNonce: 1452851995,
            isDeleted: false,
            boundElements: null,
            updated: 1724093965185,
            link: null,
            locked: false,
            status: "pending",
            fileId: fileId,
            scale: [1, 1],
        }
    };


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
        console.log("files", excalidrawAPI?.getFiles())
    }

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <input
                type="file"
                onChange={(e) => addFileToCanvas(e.target.files[0])}
            />
            <Excalidraw
                excalidrawAPI={(api) => setExcalidrawAPI(api)}
                onChange={handleSceneChange}
            />
        </div>
    );
}
