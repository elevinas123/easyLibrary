import { useAtom } from "jotai";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import {
    ForwardedRef,
    forwardRef,
    MutableRefObject,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import {
    isSpecificCircleElement,
    isSpecificRectElement,
    isSpecificTextElement,
} from "../../../../endPointTypes/typeGuards";
import { CanvaElementSkeleton, Point } from "../../../../endPointTypes/types";
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
import Circle, { CircleRef } from "./Circle/Circle";
import CustomTransformer from "./CustomTransformer";
import Rectangle, { RectangleRef } from "./Rectangle/Rectangle";
import { renderCanvaElement } from "./RenderCanvaElement";
import TextElement, { TextElementRef } from "./Text/TextElement";

type CanvasElementProps = {
    arrowShapeRef: MutableRefObject<ArrowShapeRef | null>;
    inputRef: MutableRefObject<HTMLInputElement | null>;
};

export type CanvaElementRef = {
    handleMouseDown(e: KonvaEventObject<MouseEvent>): void;
    handleDoubleClick(e: KonvaEventObject<MouseEvent>): void;
    handleKeyDown(e: KeyboardEvent): void;
    handleInputChange:
        | ((e: React.ChangeEvent<HTMLInputElement>) => void)
        | undefined;
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
    const [, setIsEditing] = useState<boolean>(false);
    const [offsetPosition] = useAtom(offsetPositionAtom);
    const [scale] = useAtom(scaleAtom); // State to handle scale
    const rectangleRef = useRef<RectangleRef | null>(null);
    const circleRef = useRef<CircleRef | null>(null);
    const textElementRef = useRef<TextElementRef | null>(null);
    useImperativeHandle(ref, () => ({
        handleMouseDown,
        handleDoubleClick,
        handleKeyDown,
        handleInputChange: textElementRef.current?.handleInputChange,
        handleMouseMove,
        handleMouseUp,
    }));

    const createElement = (element: CanvaElementSkeleton) => {
        setCanvaElements((prevItems) => [...prevItems, element]);
        setSelectedItemsIds([element.id]);
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
                textElementRef.current?.handleMouseDown(e);
                break;
            case "Arrow":
                arrowShapeRef.current?.handleMouseDown(e);
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

    const handleSelectToolMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (arrowShapeRef.current) {
            arrowShapeRef.current.handleArrowSelect(e);
        }
        const pos = getPos(offsetPosition, scale, e);

        if (!pos) return;

        const selectedItems = getItemsAtPosition(pos);
        setSelectedItemsIds(selectedItems.map((item) => item.id));

        //input blur
        if (inputRef.current) {
            inputRef.current.style.display = "none";
        }
    };

    const getItemsAtPosition = (pos: Point) => {
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
                const { x: x1, y: y1 } = item.points[0];
                const { x: x2, y: y2 } = item.points[1];
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

    const updateElement = (element: CanvaElementSkeleton) => {
        setCanvaElements((prevItems) => [
            ...prevItems.map((item) =>
                item.id === element.id ? element : item
            ),
        ]);
    };
    const deleteElement = (id: string) => {
        setCanvaElements((prevItems) =>
            prevItems.filter((item) => item.id !== id)
        );
        setSelectedItemsIds([]);
    };

    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        console.log("hi");
        rectangleRef.current?.handleMouseMove(e);
        circleRef.current?.handleMouseMove(e);
    };

    const handleMouseUp = () => {
        rectangleRef.current?.handleMouseUp();
        circleRef.current?.handleMouseUp();
        textElementRef.current?.handleMouseUp();
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

        let newAttrs: Partial<CanvaElementSkeleton> | undefined = {};

        if (isSpecificRectElement(element)) {
            newAttrs = rectangleRef.current?.handleDragMove(element, node);
        } else if (isSpecificCircleElement(element)) {
            newAttrs = circleRef.current?.handleDragMove(node);
        } else if (isSpecificTextElement(element)) {
            newAttrs = textElementRef.current?.handleDragMove(node);
        }
        if (!newAttrs) return;
        updateElementInState(id, newAttrs);
    };

    const handleDoubleClick = (e: KonvaEventObject<MouseEvent>) => {
        textElementRef.current?.handleDoubleClick(e);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        textElementRef.current?.handleKeyDown(e);
    };

    const updateElementInState = (
        id: string,
        newAttrs: Partial<CanvaElementSkeleton>
    ) => {
        setCanvaElements((elements) =>
            elements.map((el) => {
                if (el.id === id) {
                    return {
                        ...el,
                        ...newAttrs,
                        textElement: el.textElement
                            ? {
                                  ...el.textElement,
                                  ...newAttrs.textElement,
                              }
                            : undefined,
                        circleElement: el.circleElement
                            ? {
                                  ...el.circleElement,
                                  ...newAttrs.circleElement,
                                  fillStyle:
                                      newAttrs.circleElement?.fillStyle ??
                                      el.circleElement.fillStyle,
                              }
                            : undefined,
                        rectElement: el.rectElement
                            ? {
                                  ...el.rectElement,
                                  ...newAttrs.rectElement,
                              }
                            : undefined,
                        type: el.type, // Ensure the type remains the same
                    };
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
            <TextElement
                createElement={createElement}
                updateElement={updateElement}
                deleteElement={deleteElement}
                inputRef={inputRef}
                ref={textElementRef}
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
