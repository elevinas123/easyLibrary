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
        <div className="flex flex-col h-full w-full overflow-hidden">
            {/* Header */}
            <div className="h-12 p-4 flex items-center justify-center border-b ">
                s
            </div>
            {/* Scrollable Content */}
            <div className="flex justify-center w-full overflow-y-auto flex-1">
                <div
                    style={{ fontSize: `${fontSize}px`, lineHeight: "1.6" }}
                    className="flex flex-col w-full max-w-3xl break-words  p-6 rounded-lg shadow-md"
                >
                    {text.split("\n").map((line, index) => (
                        <p key={index} className="mb-2">
                            {line}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}
