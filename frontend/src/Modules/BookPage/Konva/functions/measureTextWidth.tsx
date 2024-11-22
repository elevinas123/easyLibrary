import Konva from "konva";

// Function to measure the width of a given text using Konva's Text API
export const measureTextWidth = (
    text: string,
    fontSize = 16,
    fontFamily = "Arial"
) => {
    const tempText = new Konva.Text({
        text: text,
        fontSize: fontSize,
        fontFamily: fontFamily,
        visible: false, // You don't need to render this
    });
    return tempText.width();
};


export const measureCharacterWidths = (
    text: string,
    fontSize = 16,
    fontFamily = "Arial"
) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
        return [];
    }
    context.font = `${fontSize}px ${fontFamily}`;

    // Measure each character and store cumulative widths
    const widths = [];
    let cumulativeWidth = 0;

    for (const char of text) {
        const charWidth = context.measureText(char).width;
        cumulativeWidth += charWidth;
        widths.push({ char, width: charWidth, cumulativeWidth });
    }

    return widths;
};
