import Konva from "konva";

export const measureTextWidth = (
    text: string,
    fontSize = 16,
    fontFamily = "Arial"
) => {
    const tempText = new Konva.Text({
        text: text,
        fontSize: fontSize,
        fontFamily: fontFamily,
        visible: false, // No need to render it
    });

    return tempText.getTextWidth(); // Use getTextWidth for accurate measurement
};
const charWidthCache = new Map<string, { char: string; width: number; cumulativeWidth: number }[]>();

export const measureCharacterWidths = (
    text: string,
    fontSize = 16,
    fontFamily = "Arial",
    strokeWidth = 1
) => {
    const key = `${text}_${fontSize}_${fontFamily}_${strokeWidth}`;
    if (charWidthCache.has(key)) return charWidthCache.get(key)!;

    const tempText = new Konva.Text({
        text: "",
        fontSize: fontSize,
        fontFamily: fontFamily,
        visible: false,
    });

    const widths = [];
    let cumulativeWidth = 0;

    for (let i = 0; i < text.length; i++) {
        const substring = text.substring(0, i + 1);
        tempText.text(substring);
        const substringWidth = tempText.getTextWidth() + strokeWidth;
        const charWidth = substringWidth - cumulativeWidth;
        cumulativeWidth = substringWidth;

        widths.push({
            char: text[i],
            width: charWidth,
            cumulativeWidth: substringWidth,
        });
    }

    charWidthCache.set(key, widths);
    return widths;
};
