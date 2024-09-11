import { useAtom } from "jotai";
import { Layer, Arrow } from "react-konva";
import {
    ForwardedRef,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import { activeToolAtom } from "../../konvaAtoms";
import { KonvaEventObject } from "konva/lib/Node";

type MainNotesLayerProps = {
    // Define your prop types here
};

type ArrowItem = {
    points: number[];
};
export type MainNotesLayerRef = {
    handleMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseUp: () => void;
};

function MainNotesLayer(
    {}: MainNotesLayerProps,
    ref: ForwardedRef<MainNotesLayerRef>
) {
    const [activeTool] = useAtom(activeToolAtom);
    const [arrows, setArrows] = useState<ArrowItem[]>([]); // Array to store arrows
    const [newArrow, setNewArrow] = useState<ArrowItem | null>(null); // Currently drawing arrow
    useEffect(() => {
        console.log("down");
    }, []);

    useImperativeHandle(
        ref,
        () => ({
            handleMouseDown(e: KonvaEventObject<MouseEvent>) {
                console.log("down", e);
                if (activeTool === "Arrow") {
                    // Get the start position of the arrow
                    const pos = e.target?.getStage()?.getPointerPosition();
                    if (!pos) return;
                    setNewArrow({
                        points: [pos.x, pos.y, pos.x, pos.y], // Initial start and end points are the same
                    });
                }
            },

            handleMouseMove(e: KonvaEventObject<MouseEvent>) {
                if (!newArrow || activeTool !== "Arrow") return;

                // Update the end position of the arrow as the mouse moves
                const pos = e.target?.getStage()?.getPointerPosition();
                if (!pos) return;
                const updatedArrow = {
                    ...newArrow,
                    points: [
                        newArrow.points[0],
                        newArrow.points[1],
                        pos.x,
                        pos.y,
                    ],
                };
                setNewArrow(updatedArrow); // Update the arrow being drawn
            },

            handleMouseUp() {
                if (!newArrow) return;

                // Finalize the arrow when the mouse is released
                setArrows((prevArrows) => [...prevArrows, newArrow]);
                setNewArrow(null); // Reset current arrow
            },
        }),
        [setNewArrow, setArrows, newArrow, activeTool]
    );

    return (
        <Layer>
            {/* Render finalized arrows */}
            {arrows.map((arrow, i) => (
                <Arrow
                    key={i}
                    points={arrow.points}
                    stroke="black"
                    fill="black"
                    pointerLength={10}
                    pointerWidth={10}
                    lineCap="round"
                    lineJoin="round"
                />
            ))}

            {/* Render the arrow currently being drawn */}
            {newArrow && (
                <Arrow
                    points={newArrow.points}
                    stroke="black"
                    fill="black"
                    pointerLength={10}
                    pointerWidth={10}
                    lineCap="round"
                    lineJoin="round"
                />
            )}
        </Layer>
    );
}

export default forwardRef(MainNotesLayer);
