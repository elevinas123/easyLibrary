import Konva from "konva";

// Function to measure the width of a given text using Konva
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

    return tempText.width(); // Use Konva's built-in width measurement
};

// Function to measure character widths using Konva
export const measureCharacterWidths = (
    text: string,
    fontSize = 16,
    fontFamily = "Arial"
) => {
    const tempText = new Konva.Text({
        text: "",
        fontSize: fontSize,
        fontFamily: fontFamily,
        visible: false, // No need to render it
    });

    const widths = [];
    let cumulativeWidth = 0;

    for (const char of text) {
        tempText.text(char); // Set the current character
        const charWidth = tempText.width(); // Measure character width
        cumulativeWidth += charWidth;
        widths.push({ char, width: charWidth, cumulativeWidth });
    }

    return widths;
};
