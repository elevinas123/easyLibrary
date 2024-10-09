import Konva from "konva";

// Function to measure the width of a given text using Konva's Text API
export const measureTextWidth = (
    text: string,
    fontSize = 24,
    fontFamily = "Courier New"
) => {
    const tempText = new Konva.Text({
        text: text,
        fontSize: fontSize,
        fontFamily: fontFamily,
        visible: false, // You don't need to render this
    });
    return tempText.width();
};
