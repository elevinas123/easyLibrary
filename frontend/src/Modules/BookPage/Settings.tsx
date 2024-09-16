import { useState } from "react";

export default function Settings() {
    const [background, setBackground] = useState("white");
    const [fontSize, setFontSize] = useState(16);
    const [fontFamily, setFontFamily] = useState("Arial");
    const [lineHeight, setLineHeight] = useState(1.5);

    const backgroundOptions = ["white", "beige", "black", "gray"];
    const fontSizeOptions = [12, 14, 16, 18, 20, 22, 24];
    const fontFamilyOptions = [
        "Arial",
        "Georgia",
        "Times New Roman",
        "Verdana",
    ];
    const lineHeightOptions = [1.5, 1.75, 2];

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300">
                    Background Color
                </label>
                <select
                    className="mt-1 block w-full bg-zinc-800 text-gray-300 p-2 rounded"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                >
                    {backgroundOptions.map((color) => (
                        <option key={color} value={color}>
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">
                    Font Size
                </label>
                <select
                    className="mt-1 block w-full bg-zinc-800 text-gray-300 p-2 rounded"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                >
                    {fontSizeOptions.map((size) => (
                        <option key={size} value={size}>
                            {size}px
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">
                    Font Family
                </label>
                <select
                    className="mt-1 block w-full bg-zinc-800 text-gray-300 p-2 rounded"
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                >
                    {fontFamilyOptions.map((font) => (
                        <option key={font} value={font}>
                            {font}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">
                    Line Height
                </label>
                <select
                    className="mt-1 block w-full bg-zinc-800 text-gray-300 p-2 rounded"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                >
                    {lineHeightOptions.map((height) => (
                        <option key={height} value={height}>
                            {height}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
