import { useEffect, useState } from "react";
import { loadPdfText } from "./functions/loadPdfText";
import Text from "./Modules/BookPage/Text";
import Chapters from "./Modules/BookPage/Chapters";
import Notes from "./Modules/BookPage/Notes";
import RightHand from "./Modules/BookPage/RightHand";

function App() {
    const [pdfText, setPdfText] = useState("");
    const [error, setError] = useState<null | string>(null);
    const [fontSize, setFontSize] = useState(24);

    useEffect(() => {
        const getText = async () => {
            try {
                const text = await loadPdfText("/test2.pdf");
                setPdfText(text);
            } catch (error) {
                console.log("error", error);
                setError("Failed to load PDF. Please try another file.");
            }
        };
        getText();
    }, []);

    const handleFontSizeChange = (event) => {
        setFontSize(event.target.value);
    };

    return (
        <div className="flex flex-row bg-zinc-800 text-gray-300">
            <Chapters />
            <Text text={pdfText} fontSize={fontSize} />
            <RightHand />
        </div>
    );
}

export default App;
