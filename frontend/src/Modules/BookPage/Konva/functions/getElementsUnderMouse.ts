import { ArrowHover } from "../konvaAtoms";
import { FullHighlight } from "../modules/BookTextLayers/HighlightLayer";

export const getHighlightUnderMouse = (
    highlightElements: FullHighlight[] | ArrowHover[],
    pos: { x: number; y: number }
) => {
    return highlightElements.filter((highlight) =>
        highlight.rects?.some((rect) => {
            return (
                pos.x >= rect.x - 10 &&
                pos.x <= rect.x + rect.width + 10 &&
                pos.y >= rect.y - 10 &&
                pos.y <= rect.y + rect.height + 10
            );
        })
    );
};
export const getArrowHighlightsUnderMouse = (
    hoveredItems: ArrowHover[],
    pos: { x: number; y: number }
) =>
    hoveredItems.filter((highlight) => {
        if (highlight.rects) {
            return highlight.rects.some((rect) => {
                return (
                    pos.x >= rect.x - 10 &&
                    pos.x <= rect.x + rect.width + 10 &&
                    pos.y >= rect.y - 10 &&
                    pos.y <= rect.y + rect.height + 10
                );
            });
        } else {
            return (
                pos.x >= highlight.points[0].x - 10 &&
                pos.x <= highlight.points[1].x &&
                pos.y >= highlight.points[0].y - 10 &&
                pos.y <= highlight.points[2].y + 10
            );
        }
    });

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
