import { useState } from "react";

import Tesseract from "tesseract.js";

type TextProps = {
    parahraphs: Tesseract.Paragraph[];
    fontSize: number;
};


export default function ExcalidrawText({ paragraphs, fontSize }: TextProps) {
    const [elements, setElements] = useState<Tesseract.Page[]>([]);
    const wordsInLine = 5;
    const maxCharactersPerLine = 90;
    const lineHeight = 30;

    return (
        <div style={{ minHeight: "100vh", width: "100%" }}>
            {elements.map((element) => (
                <p className="truncate">{element}</p>
            ))}
        </div>
    );
}
