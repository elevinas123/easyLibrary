import { ExcalidrawTextElement } from "@excalidraw/excalidraw/types/element/types";
import { v4 as uuidv4 } from "uuid"; // Assuming you're using uuid library

type PartialExcalidrawTextElement = Partial<
    Omit<ExcalidrawTextElement, "x" | "y" | "text" | "width" | "height">
>;

export const createTextElement = ({
    x,
    y,
    text,
    width,
    height,
    ...optionalProps
}: {
    x: number;
    y: number;
    text: string;
    width: number;
    height: number;
} & PartialExcalidrawTextElement): ExcalidrawTextElement => {
    const textElementDefault: ExcalidrawTextElement = {
        id: uuidv4(),
        type: "text",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        angle: 0,
        strokeColor: "#1e1e1e",
        backgroundColor: "transparent",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        groupIds: [],
        frameId: null,
        roundness: null,
        seed: Date.now() + 1,
        version: 1,
        versionNonce: 0,
        isDeleted: false,
        boundElements: null,
        updated: Date.now(),
        link: null,
        locked: false,
        text: "",
        fontSize: 20,
        fontFamily: 0,
        textAlign: "left",
        verticalAlign: "top",
        baseline: 19,
        containerId: null,
        originalText: "",
        lineHeight: 1.25,
        customData: {
            type: "book"
        }
    };

    return {
        ...textElementDefault,
        x,
        y,
        text,
        width,
        height,
        ...optionalProps,
    };
};
