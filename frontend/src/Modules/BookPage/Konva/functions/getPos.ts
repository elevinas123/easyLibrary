import Konva from "konva";

export const getPos = (
    offsetPosition: { x: number; y: number },
    scale: number,
    e: Konva.KonvaEventObject<MouseEvent>
) => {
    const stage = e.currentTarget?.getStage();
    const pointer = stage?.getPointerPosition();
    console.log("Mouse down pointer", pointer);
    console.log("Mouse down offsetPosition", offsetPosition);
    if (!pointer) return null;

    return {
        x: (pointer.x - offsetPosition.x) / scale,
        y: (pointer.y - offsetPosition.y) / scale,
    };
};
