import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import {
    currentHighlightAtom,
    highlightOptionsAtom,
    highlightsAtom,
    hoveredItemsAtom,
} from "../../konvaAtoms";
import { Button } from "../../../../../components/ui/button";

type HoverOptionsTabProps = {
    // Define your prop types here
};

export default function HoverOptionsTab({}: HoverOptionsTabProps) {
    const [highlightOptions, setHighlightOptions] = useAtom(highlightOptionsAtom);
    const [currentHighlight, setCurrentHighlight] = useAtom(currentHighlightAtom);
    const [highlights, setHighlights] = useAtom(highlightsAtom);
    const [hoveredItems, setHoveredItems] = useAtom(hoveredItemsAtom);

    const deleteHiglight = () => {
        console.log("Delete Highlight", highlightOptions);
        console.log("highlights", highlights);
        console.log("currentHighlight", currentHighlight);

        setHighlights((highlights) => {
            return [
                ...highlights.filter(
                    (highlight) => highlight.id !== highlightOptions.highlightId
                ),
            ];
        });
        setHoveredItems([]);
        setHighlightOptions({
             active: false,
    highlightId: null,
    mousePosition: { x: 0, y: 0 },
        })
        setCurrentHighlight({
            id: null,
    editing: false,
    creating: false
        })
    };
    return (
        <div className="absolute z-50">
            {highlightOptions.active && !currentHighlight.creating ? (
                <div
                    style={{
                        position: "absolute",
                        top: highlightOptions.mousePosition.y,
                        left: highlightOptions.mousePosition.x,
                    }}
                    className="bg-white rounded-lg shadow-lg"
                >
                    <div className="p-2">Highlight</div>
                    <Button onClick={deleteHiglight}>Delete</Button>
                    <div className="p-2">Comment</div>
                </div>
            ) : null}
        </div>
    );
}
