import React from "react";

type ParagraphProps = {
    children: React.ReactNode;
};

type StyledTextProps = {
    children: React.ReactNode;
};

type CharProps = {
    char: string;
};
export const Paragraph: React.FC<ParagraphProps> = ({ children }) => {
    return (
        <p
            style={{
                marginBottom: "1.5em",
                wordWrap: "break-word", // Prevents long words from breaking the layout
                overflow: "hidden", // Ensures content doesn't overflow its container
                width: "100%", // Ensure the paragraph takes the full width of its container
            }}
        >
            {children}
        </p>
    );
};

export const StyledText: React.FC<StyledTextProps> = ({ children }) => {
    return <span style={{ whiteSpace: "normal" }}>{children}</span>;
};

export const Char: React.FC<CharProps> = ({ char }) => {
    return <span className="text-xl">{char}</span>;
};
