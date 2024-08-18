import { useEffect, useState } from "react";
import { loadPdfText } from "./functions/loadPdfText";
import Text from "./Modules/BookPage/Text";
import Chapters from "./Modules/BookPage/Chapters";

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
        <div className="">
                <Chapters />
            <Text text={pdfText} fontSize={fontSize} />
            
        </div>
    );
}

export default App;
