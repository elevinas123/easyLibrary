import { FullHighlight } from "../modules/BookTextLayers/HighlightLayer";

export const getHighlightUnderMouse = (
    highlightElements: FullHighlight[],
    pos: { x: number; y: number }
) => {
    return highlightElements.filter((highlight) =>
        highlight.rects.some((rect) => {
            return (
                pos.x >= rect.x - 10 &&
                pos.x <= rect.x + rect.width + 10 &&
                pos.y >= rect.y - 10 &&
                pos.y <= rect.y + rect.height + 10
            );
        })
    );
};

export const isPointInPolygon = (
    point: { x: number; y: number },
    polygon: { x: number; y: number }[]
) => {
    let isInside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x,
            yi = polygon[i].y;
        const xj = polygon[j].x,
            yj = polygon[j].y;

        const intersect =
            yi > point.y !== yj > point.y &&
            point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
        if (intersect) isInside = !isInside;
    }
    return isInside;
};
