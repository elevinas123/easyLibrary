import React, { useEffect, useState } from "react";
import { StyledText, Paragraph, Char } from "./TextComponents";
import {
    HtmlObject,
    ParagraphObject,
    HeadingObject,
    CharObject,
    StyledTextObject,
} from "./preprocessEpub";
import { highlightedRangeAtom } from "../../atoms";
import { useAtom } from "jotai";

type TextProps = {
    bookElements: (HtmlObject | null)[];
    fontSize: number;
    handleEpubChange: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => Promise<void>;
};

export default function Text({
    bookElements,
    fontSize,
    handleEpubChange,
}: TextProps) {
    const [highlightedRanges, setHighlightedRanges] =
        useAtom(highlightedRangeAtom);

    const handleMouseUp = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const startContainer = range.startContainer.parentElement;
            const endContainer = range.endContainer.parentElement;

            if (!startContainer || !endContainer) return;

            const startId = startContainer.id;
            const endId = endContainer.id;

            if (startId && endId) {
                setHighlightedRanges((prev) => [...prev, { startId, endId }]);
            }
        }
    };
    const isCharHighlighted = (charId: string): boolean => {
        const [charParentId, charIndex] = charId
            .split("-")
            .slice(1)
            .map(Number);

        return highlightedRanges.some(({ startId, endId }) => {
            const [startParentId, startIndex] = startId
                .split("-")
                .slice(1)
                .map(Number);
            const [endParentId, endIndex] = endId
                .split("-")
                .slice(1)
                .map(Number);

            if (charParentId < startParentId || charParentId > endParentId) {
                return false;
            }
            if (
                charParentId === startParentId &&
                charParentId === endParentId
            ) {
                return startIndex <= charIndex && charIndex <= endIndex;
            }
            if (charParentId === startParentId) {
                return charIndex >= startIndex;
            }
            if (charParentId === endParentId) {
                return charIndex <= endIndex;
            }
            return true;
        });
    };

    const renderContent = (
        element: ParagraphObject | HeadingObject,
        index: number
    ) => {
        if (element.type === "paragraph" || element.type === "heading") {
            const children = element.children.map((child, childIndex) => {
                if ("text" in child && Array.isArray(child.text)) {
                    return (
                        <StyledText
                            key={`styled-${index}-${childIndex}`}
                            style={child.style}
                        >
                            {child.text.map((charObj: CharObject) => (
                                <Char
                                    key={charObj.id}
                                    char={charObj.char}
                                    id={charObj.id}
                                    parentIndex={index}
                                    isHighlighted={isCharHighlighted(
                                        charObj.id
                                    )}
                                />
                            ))}
                        </StyledText>
                    );
                } else if ("char" in child) {
                    return (
                        <Char
                            key={child.id}
                            char={child.char}
                            id={child.id}
                            parentIndex={index}
                            isHighlighted={isCharHighlighted(child.id)}
                        />
                    );
                }
                return null;
            });

            return element.type === "paragraph" ? (
                <Paragraph key={`paragraph-${index}`}>{children}</Paragraph>
            ) : (
                <h1
                    key={`heading-${index}`}
                    style={{ fontSize: `${fontSize}px` }}
                >
                    {children}
                </h1>
            );
        }

        return null;
    };

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [highlightedRanges]);
    useEffect(() => {
        console.log("bookElements", highlightedRanges);
    }, [highlightedRanges]);

    return (
        <div className="w-full flex flex-col items-center">
            <input
                type="file"
                placeholder="Select EPUB"
                accept=".epub"
                onChange={handleEpubChange}
            />
            <div
                className="w-96"
                style={{ overflow: "hidden", maxWidth: "100%" }}
            >
                {bookElements.map((element, index) => {
                    if (!element) return null;
                    return (
                        <React.Fragment key={`fragment-${index}`}>
                            {element.elements.map((childElement, childIndex) =>
                                renderContent(childElement, childIndex)
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
