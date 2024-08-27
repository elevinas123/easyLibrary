import { useEffect, useState } from "react";
import Text from "./Modules/BookPage/Text";
import Chapters from "./Modules/BookPage/Chapters";
import RightHand from "./Modules/BookPage/RightHand";
import { readEpub } from "./preprocess/epub/readEpub";

function App() {
    const [epubText, setEpubText] = useState<string[]>([]);
    const [error, setError] = useState<null | string>(null);
    const [fontSize, setFontSize] = useState(24);

    const handleEpubChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const paragraphs = await readEpub(file);
                console.log("paraghps", paragraphs);
                setEpubText(paragraphs);
            } catch (error) {
                console.log("error", error);
                setError("Failed to load EPUB. Please try another file.");
            }
        }
    };

    return (
        <div className="flex  min-h-screen flex-row w-full bg-zinc-800 text-gray-300">
            <Chapters />

            <Text
                handleEpubChange={handleEpubChange}
                paragraphs={epubText}
                fontSize={fontSize}
            />
            <RightHand />
        </div>
    );
}

export default App;
