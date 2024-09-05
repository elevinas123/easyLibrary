import { Layer, Text } from "react-konva";
import {
    HtmlElementObject,
    HtmlObject,
} from "../../../../preprocess/epub/preprocessEpub";
type BookTextItemProps = {
    bookElements: (HtmlObject | null)[]; // Contains the text and styling details
};
const fontSize = 24;
const width = 1200;

const processTextIntoLines = (
    element: HtmlElementObject,
    indexStart: number
) => {
    let textLines: string[][] = [[]];
    let currentLineWidth = 0;
    for (let i = 0, j = 0; i < element.text.length; i++) {
        if (currentLineWidth + fontSize <= width && element.text[i] !== "\n") {
            textLines[j].push(element.text[i]);
            currentLineWidth += fontSize;
        } else {
            j++;
            textLines.push([]);
            if (element.text[i] === "\n") {
                currentLineWidth = 0;
            } else {
                currentLineWidth = fontSize;
                textLines[j].push(element.text[i]);
            }
        }
    }
    return textLines
        .filter((line) => line.length > 0)
        .map((line, lineIndex) => ({
            text: line.join(""),
            lineX: 0,
            lineWidth: line.length * fontSize,
            lineY: lineIndex + indexStart,
        }));
};

const processElements = (elements: HtmlObject, indexStart: number) => {
    let currentIndex = indexStart;

    const processedLines = elements.elements.flatMap((element) => {
        const lines = processTextIntoLines(element, currentIndex);
        currentIndex += lines.length; // Increment the index by the number of lines processed
        return lines;
    });

    return processedLines;
};

const BookTextItems = ({ bookElements }: BookTextItemProps) => {
    const renderText = (bookElements: (HtmlObject | null)[]) => {
        console.log(bookElements);
        let indexStart = 0; // Start indexing from 0 or any preferred value

        const processedElements = bookElements
            .filter((elements) => elements !== null)
            .flatMap((elements) => {
                const result = processElements(elements, indexStart);
                indexStart += result.length; // Increment the index for the next element block
                return result;
            })
            .filter((element, index) => index < 1000 );

        console.log("processedElements", processedElements);
        return processedElements.map((textElement) => (
            <Text
                x={textElement.lineX + 600}
                y={textElement.lineY*fontSize + 200}
                width={textElement.lineWidth}
                height={fontSize}
                text={textElement.text}
                fontSize={fontSize}
                fill={"white"}
            ></Text>
        ));
    };

    return <Layer>{renderText(bookElements)}</Layer>;
};

export default BookTextItems;
