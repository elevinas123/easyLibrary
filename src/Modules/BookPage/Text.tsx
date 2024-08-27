import React from "react";

type TextProps = {
    paragraphs: string[];
    fontSize: number;
};

export default function Text({ paragraphs, fontSize }: TextProps) {
    const lineHeight = fontSize * 1.5; // Line height based on font size

    const renderParagraphs = () => {
        return paragraphs.map((paragraph, paraIndex) => (
            <div
                key={paraIndex}
                style={{
                    marginBottom: `${lineHeight}px`,
                    fontSize: `${fontSize}px`,
                    lineHeight: `${lineHeight}px`,
                }}
                dangerouslySetInnerHTML={{ __html: paragraph }}
            />
        ));
    };

    return (
        <div style={{ minHeight: "100vh", width: "100%" }}>
            {renderParagraphs()}
        </div>
    );
}
