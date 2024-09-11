import { useAtom } from "jotai";
import { useEffect } from "react";
import { Layer } from "react-konva";
import { hoveredHighlightAtom } from "../../konvaAtoms";

type HoverHighlightLayerProps = {
    // Define your prop types here
};

export default function HoverHighlightLayer({ props }: HoverHighlightLayerProps) {
    const [hoveredHighlight, setHoveredHighlight] =
        useAtom(hoveredHighlightAtom);

    
    
    useEffect(() => {
        console.log("hoveredHighlight", hoveredHighlight)
    }, [hoveredHighlight]);
    return (
    <></>
    );
}