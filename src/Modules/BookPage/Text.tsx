import React from "react";
import {load}  from 'cheerio';
import { StyledText, Paragraph, Char } from "./TextComponents";

type TextProps = {
    paragraphs: string[];
    fontSize: number;
    handleEpubChange: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => Promise<void>;
};

export default function Text({
    paragraphs,
    fontSize,
    handleEpubChange,
}: TextProps) {
    const renderContent = (html: string) => {
        const $ = load(html);

        const renderedContent = $("body")
            .children()
            .map((_, elem) => {
                if (elem.tagName === "p") {
                    // Extract paragraph text and styles
                    const children = $(elem)
                        .contents()
                        .map((_, child) => {
                            if (child.type === "text") {
                                return <Char char={child.data!} />;
                            } else if (child.tagName === "span") {
                                const style = $(child).attr("style") || "";
                                return (
                                    <StyledText >
                                        {$(child).text()}
                                    </StyledText>
                                );
                            }
                        })
                        .get();
                    return <Paragraph>{children}</Paragraph >;
                } else {
                    console.log("elem", elem.tagName, elem)
                }
                // Handle other elements like headings, etc.
            })
            .get();

        return renderedContent;
    };


    return (
        <div className="w-full flex flex-col items-center">
            <input
                type="file"
                placeholder="Select EPUB"
                accept=".epub"
                onChange={handleEpubChange}
            />
            <div className="w-96">
                {paragraphs.map((paragraph, index) => (
                    <React.Fragment key={index}>
                        {renderContent(paragraph)}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
