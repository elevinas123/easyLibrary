import { useEffect } from "react";

type TextProps = {
    text: string;
    fontSize: number;
};

export default function Text({ text, fontSize }: TextProps) {
    useEffect(() => {
        console.log("fontSize", fontSize);
    }, [fontSize]);

    return (
        <div className="flex justify-center w-full">
            <div
                style={{ fontSize: `${fontSize}px`, lineHeight: "1.6" }} // Set fontSize with units and adjust lineHeight
                className="flex flex-col w-full max-w-3xl break-words bg-gray-100 text-gray-900 p-6 rounded-lg shadow-md"
            >
                {text.split("\n").map((line, index) => (
                    <p key={index} className="mb-2">
                        {line}
                    </p>
                ))}
            </div>
        </div>
    );
}
