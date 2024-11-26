import { useAtom } from "jotai";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import {
    ForwardedRef,
    forwardRef,
    MutableRefObject,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { getPos } from "../functions/getPos";
import {
    activeToolAtom,
    arrowsAtom,
    canvaElementsAtom,
    offsetPositionAtom,
    scaleAtom,
    selectedItemsIdsAtom,
} from "../konvaAtoms";
import { ArrowShapeRef } from "./Arrow/ArrowShape";
import CustomTransformer from "./CustomTransformer";
import CreateRectangle from "./Rectangle/createRectangle";
import { renderCanvaElement } from "./RenderCanvaElement";
import {
    CanvaElementType,
    RectElementType,
    TextElementType,
} from "../../../../endPointTypes/types";
import CreateText from "./Text/CreateText";
import Rectangle, { RectangleRef } from "./Rectangle/Rectangle";
import Circle, { CircleRef } from "./Circle/Circle";

type CanvasElementProps = {
    arrowShapeRef: MutableRefObject<ArrowShapeRef | null>;
    inputRef: MutableRefObject<HTMLInputElement | null>;
};

export type CanvaElementRef = {
    handleMouseDown(e: KonvaEventObject<MouseEvent>): void;
    handleDoubleClick(e: KonvaEventObject<MouseEvent>): void;
    handleKeyDown(e: KeyboardEvent): void;
    handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
    handleMouseMove: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseUp: () => void;
};

function CanvasElement(
    { arrowShapeRef, inputRef }: CanvasElementProps,
    ref: ForwardedRef<CanvaElementRef>
) {
    const [canvaElements, setCanvaElements] = useAtom(canvaElementsAtom);
    const [selectedItemsIds, setSelectedItemsIds] =
        useAtom(selectedItemsIdsAtom);
    const [arrows] = useAtom(arrowsAtom);

    const [activeTool] = useAtom(activeToolAtom);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [offsetPosition] = useAtom(offsetPositionAtom);
    const [scale] = useAtom(scaleAtom); // State to handle scale
    const rectangleRef = useRef<RectangleRef | null>(null);
    const circleRef = useRef<CircleRef | null>(null);
    useImperativeHandle(ref, () => ({
        handleMouseDown,
        handleDoubleClick,
        handleKeyDown,
        handleInputChange,
        handleMouseMove,
        handleMouseUp,
    }));

    useEffect(() => {
        if (inputRef.current && isEditing && selectedItemsIds.length > 0) {
            const textItem = canvaElements.find(
                (item) =>
                    item.type === "text" && item.id === selectedItemsIds[0]
            ) as TextElementType | undefined;

            if (textItem) {
                const input = inputRef.current;
                input.style.left = `${textItem.x}px`;
                input.style.top = `${textItem.y}px`;
                input.style.fontSize = `${textItem.fontSize}px`;
                input.style.display = "block";
                input.value = textItem.text;
                input.style.width = `${textItem.width}px`;
                input.focus();
                return;
            }
        }
        handleInputBlur();
    }, [isEditing, selectedItemsIds, canvaElements]);

    const createElement = (element: CanvaElementType) => {
        setCanvaElements((prevItems) => [...prevItems, element]);
        setSelectedItemsIds([element.id]);
        setIsCreating(true);
    };

    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        const transformer = stage?.findOne<Konva.Transformer>("Transformer");
        if (transformer) {
            const clickedOnTransformer =
                (e.target as unknown as Konva.Transformer) === transformer ||
                transformer?.children?.includes(e.target);
            if (clickedOnTransformer) {
                // Do not deselect if clicking on the transformer
                return;
            }
        }
        console.log("mouseDown", activeTool);
        // Check if the click is on the transformer or its children
        const pos = getPos(offsetPosition, scale, e);
        if (!pos) return;
        switch (activeTool) {
            case "Text":
                handleTextToolMouseDown(pos);
                break;
            case "Arrow":
                if (arrowShapeRef.current) {
                    arrowShapeRef.current.handleMouseDown(e);
                }
                break;
            case "Rectangle":
                rectangleRef.current?.handleMouseDown(e);
                break;
            case "Select":
                handleSelectToolMouseDown(e);
                break;
            case "Circle":
                circleRef.current?.handleMouseDown(e);
                break;
            default:
                setIsEditing(false);
                setSelectedItemsIds([]);
                break;
        }
    };

    const handleTextToolMouseDown = (pos: { x: number; y: number }) => {
        const id = uuidv4();
        const newText = CreateText({
            x: pos.x,
            y: pos.y,
            id,
            text: "Sample Text",
            width: 24 * 8 + 10,
            height: 24 + 10,
        });
        setCanvaElements((prevItems) => [...prevItems, newText]);
        setSelectedItemsIds([id]);
        setIsCreating(true);
    };

    const handleSelectToolMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (arrowShapeRef.current) {
            arrowShapeRef.current.handleArrowSelect(e);
        }
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;

        const selectedItems = getItemsAtPosition(pos);
        setSelectedItemsIds(selectedItems.map((item) => item.id));

        setIsEditing(false);
        handleInputBlur();
    };

    const getItemsAtPosition = (pos: { x: number; y: number }) => {
        console.log("canvaElemenets", canvaElements);
        const items = [
            ...canvaElements.filter((item) => {
                return (
                    pos.x >= item.x &&
                    pos.x <= item.x + item.width &&
                    pos.y >= item.y &&
                    pos.y <= item.y + item.height
                );
            }),
            ...arrows.filter((item) => {
                const [x1, y1, x2, y2] = item.points;

                // Calculate the minimum and maximum x and y values
                const minX = Math.min(x1, x2);
                const maxX = Math.max(x1, x2);
                const minY = Math.min(y1, y2);
                const maxY = Math.max(y1, y2);

                // Check if the position falls within the bounding box
                return (
                    pos.x >= minX &&
                    pos.x <= maxX &&
                    pos.y >= minY &&
                    pos.y <= maxY
                );
            }),
        ];
        console.log("getting items", items);
        return items;
    };

    const updateElement = (element: CanvaElementType) => {
        setCanvaElements((prevItems) => [
            ...prevItems.map((item) =>
                item.id === element.id ? element : item
            ),
        ]);
    };

    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        console.log("hi");
        if (rectangleRef.current?.handleMouseMove) {
            rectangleRef.current.handleMouseMove(e);
        }
        if (circleRef.current?.handleMouseMove) {
            circleRef.current.handleMouseMove(e);
        }
    };

    const handleMouseUp = () => {
        if (rectangleRef.current?.handleMouseUp) {
            rectangleRef.current.handleMouseUp();
        }
        if (circleRef.current?.handleMouseUp) {
            circleRef.current.handleMouseUp();
        }
    };

    const handleDragMove = (e: KonvaEventObject<MouseEvent>) => {
        const node = e.target;
        const id = node.id();

        if (arrowShapeRef.current) {
            arrowShapeRef.current.handleElementAttachedToArrowMove(
                selectedItemsIds
            );
        }

        const element = canvaElements.find((el) => el.id === id);
        if (!element) return;

        let newAttrs: Partial<CanvaElementType> = {};

        if (element.type === "rect") {
            newAttrs = {
                x: node.x(),
                y: node.y(),
                points: [
                    { x: node.x(), y: node.y() },
                    { x: node.x() + element.width, y: node.y() },
                    {
                        x: node.x() + element.width,
                        y: node.y() + element.height,
                    },
                    { x: node.x(), y: node.y() + element.height },
                ],
            };
        } else if (element.type === "circle") {
            const newX = node.x();
            const newY = node.y();
            newAttrs = {
                x: newX,
                y: newY,
            };
        } else if (element.type === "text") {
            newAttrs = {
                x: node.x(),
                y: node.y(),
            };
        }

        updateElementInState(id, newAttrs);
    };

    const handleDoubleClick = (e: KonvaEventObject<MouseEvent>) => {
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;

        const clickedItem = getItemsAtPosition(pos).find(
            (item) => item.type === "text"
        );

        if (clickedItem) {
            setIsEditing(true);
            setSelectedItemsIds([clickedItem.id]);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (isEditing) return;
        if (e.key === "Delete" || e.key === "Backspace") {
            if (selectedItemsIds.length > 0) {
                setCanvaElements((prevItems) =>
                    prevItems.filter(
                        (item) => !selectedItemsIds.includes(item.id)
                    )
                );
                setSelectedItemsIds([]);
            }
        }
    };

    const handleInputBlur = () => {
        if (inputRef.current) {
            inputRef.current.style.display = "none";
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedItemsIds.length === 0) return;
        const newText = e.target.value;
        const newWidth = newText.length * 24 + 20;
        updateElementInState(selectedItemsIds[0], {
            text: newText,
            width: newWidth,
        });
    };

    const updateElementInState = (
        id: string,
        newAttrs: Partial<CanvaElementType>
    ) => {
        setCanvaElements((elements) =>
            elements.map((el) => {
                if (el.id === id) {
                    return {
                        ...el,
                        ...newAttrs,
                        type: el.type, // Ensure the type remains the same
                    } as CanvaElementType;
                }
                return el;
            })
        );
    };

    return (
        <>
            {canvaElements.map((element) =>
                renderCanvaElement(
                    element,
                    activeTool === "Select",
                    handleDragMove
                )
            )}
            <Rectangle
                createElement={createElement}
                updateElement={updateElement}
                ref={rectangleRef}
            />
            <Circle
                createElement={createElement}
                updateElement={updateElement}
                ref={circleRef}
            />

            <CustomTransformer
                selectedIds={selectedItemsIds.filter(
                    (id) => !arrows.some((arrow) => arrow.id === id)
                )}
                updateElementInState={updateElementInState}
            />
        </>
    );
}

export default forwardRef(CanvasElement);
