import { useAtom } from "jotai";
import { Layer, Arrow, Text } from "react-konva";
import {
    ForwardedRef,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
    useRef,
} from "react";
import { activeToolAtom } from "../../konvaAtoms";
import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import { Html } from "react-konva-utils";

type MainNotesLayerProps = {
    // Define your prop types here
};

export type ShapeType = "Rectangle" | "Circle" | "Arrow" | "Line" | "Text";
const drawingShapes = ["Rectangle", "Circle", "Arrow", "Line", "Text"];

type ArrowItem = {
    points: number[];
};

type TextItem = {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    isSelected: boolean;
    width: number;
    height: number;
};

export type MainNotesLayerRef = {
    handleMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
    handleDoubleClick: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseUp: () => void;
    handleKeyDown: (e: KeyboardEvent) => void;
};

function MainNotesLayer(
    {}: MainNotesLayerProps,
    ref: ForwardedRef<MainNotesLayerRef>
) {
    const [activeTool] = useAtom(activeToolAtom);
    const [arrows, setArrows] = useState<ArrowItem[]>([]);
    const [newArrow, setNewArrow] = useState<ArrowItem | null>(null);
    const [textItems, setTextItems] = useState<TextItem[]>([]);
    const [selectedTextId, setSelectedTextId] = useState<string | null>(null); // Track selected text
    const [isEditing, setIsEditing] = useState<boolean>(false); // Track if text is being edited
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });
    // Handle Mouse Down
    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (activeTool === "Text") {
            const pos = e.target?.getStage()?.getPointerPosition();
            if (!pos) return;
            const id = `${Date.now()}`;
            const newItem = {
                id,
                text: "New Text",
                x: pos.x,
                y: pos.y,
                fontSize: 24,
                isSelected: true,
                width: 24 + 10,
                height: 24 + 10,
            };
            setTextItems([...textItems, newItem]);
            setSelectedTextId(id);
            setIsEditing(true);
        } else {
            setSelectedTextId(null); // Deselect text when clicking elsewhere
        }
    };
    useEffect(() => {
        console.log(inputRef.current, isEditing, selectedTextId);
        if (inputRef.current && isEditing && selectedTextId) {
            console.log("cia");
            const selectedItem = textItems.filter(
                (item) => item.id === selectedTextId
            );
            if (selectedItem && selectedItem.length > 0) {
                const textItem = selectedItem[0];
                const input = inputRef.current;

                console.log("input", inputRef);
                input.style.left = `${textItem.x}px`;
                input.style.top = `${textItem.y}px`;
                input.style.fontSize = `${textItem.fontSize}px`;
                input.style.display = "block";
                input.value = textItem.text;
                input.style.fontSize = `${textItem.fontSize}px`
                input.focus();
                return;
            }
        }
        handleInputBlur();
    }, [isEditing, selectedTextId, textItems]);
    useEffect(() => {
        console.log("isEditing", isEditing);
    }, [isEditing]);
    // Handle Text Double Click for Editing
   

    // Handle Input Change and Save Text
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedTextId) return;
        const updatedTextItems = textItems.map((item) =>
            item.id === selectedTextId
                ? {
                      ...item,
                      text: e.target.value,
                      width: e.target.value.length * 24 + 20,
                  }
                : item
        );
        setTextItems(updatedTextItems);
    };

    const handleInputBlur = () => {
        if (inputRef.current) {
            inputRef.current.style.display = "none";
        }
    };

    // Handle Delete Key Press
    const handleKeyDown = (e: KeyboardEvent) => {
        if (isEditing) return
        if (e.key === "Delete" || e.key === "Backspace") {
            if (selectedTextId) {
                setTextItems((prevItems) =>
                    prevItems.filter((item) => item.id !== selectedTextId)
                );
                setSelectedTextId(null);
            }
        }
    };

    // Handle Mouse Move for Arrows (Existing)
    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        if (!newArrow || activeTool !== "Arrow") return;
        const pos = e.target?.getStage()?.getPointerPosition();
        if (!pos) return;
        const updatedArrow = {
            ...newArrow,
            points: [newArrow.points[0], newArrow.points[1], pos.x, pos.y],
        };
        setNewArrow(updatedArrow);
    };

    // Handle Mouse Up for Arrows (Existing)
    const handleMouseUp = () => {
        if (!newArrow) return;
        setArrows((prevArrows) => [...prevArrows, newArrow]);
        setNewArrow(null);
    };
    const handleDoubleClick = (e: KonvaEventObject<MouseEvent>) => {
        textItems.forEach((textItem) => {
            const isInsideXBounds =
                e.evt.x >= textItem.x && e.evt.x <= textItem.x + textItem.width;
            const isInsideYBounds =
                e.evt.y >= textItem.y &&
                e.evt.y <= textItem.y + textItem.height;

            if (isInsideXBounds && isInsideYBounds) {
                setIsEditing(true)
                setSelectedTextId(textItem.id)
                return
            }
        });
    };

    useImperativeHandle(ref, () => ({
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleKeyDown,
        handleDoubleClick,
    }));

    return (
        <>
            <Layer>
                <Html>
                    <input
                        ref={inputRef}
                        type="text"
                        style={{
                            display: "none",
                            position: "absolute",
                            backgroundColor: "#27272a", // zinc-800
                            color: "#d1d5db", // gray-300
                            border: "0", // gray-300 border
                            outline: "none", // Removes default outline for focus states
                        }}
                        onChange={handleInputChange}
                    />
                </Html>
                {/* Render arrows */}
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

                {/* Render text items */}
                {textItems.map((textItem) => (
                    <Text
                        key={textItem.id}
                        text={textItem.text}
                        x={textItem.x}
                        y={textItem.y}
                        fontSize={textItem.fontSize}
                        fill={selectedTextId === textItem.id ? "blue" : "black"}
                    />
                ))}
            </Layer>
        </>
    );
}

export default forwardRef(MainNotesLayer);
