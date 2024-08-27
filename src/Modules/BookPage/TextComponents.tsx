import React from "react";
import { HighlightRange } from "./preprocessEpub";

type ParagraphProps = {
    id: string;
    text: string;
    highlights: HighlightRange[];
    style?: React.CSSProperties;
};

export const Paragraph: React.FC<ParagraphProps> = ({
    id,
    text,
    highlights,
    style,
}) => {
    const renderTextWithHighlights = () => {
        const elements = [];
        let lastIndex = 0;

        highlights.forEach(
            (
                {
                    startElementId,
                    startOffset,
                    endElementId,
                    endOffset,
                    intermediateElementIds,
                },
                index
            ) => {
                if (
                    startElementId === id ||
                    endElementId === id ||
                    intermediateElementIds?.includes(id)
                ) {
                    const highlightStart =
                        startElementId === id ? startOffset : 0;
                    const highlightEnd =
                        endElementId === id ? endOffset + 1 : text.length;

                    // Add text before the highlight starts
                    if (lastIndex < highlightStart) {
                        elements.push(
                            <span key={`text-${index}-${lastIndex}`}>
                                {text.slice(lastIndex, highlightStart)}
                            </span>
                        );
                    }

                    // Add the highlighted text
                    elements.push(
                        <span
                            key={`highlight-${index}`}
                            className="bg-green-800"
                        >
                            {text.slice(highlightStart, highlightEnd)}
                        </span>
                    );

                    lastIndex = highlightEnd;
                }
            }
        );

        // Add any remaining unhighlighted text after the last highlight
        if (lastIndex < text.length) {
            elements.push(
                <span key={`text-end-${lastIndex}`}>
                    {text.slice(lastIndex)}
                </span>
            );
        }

        return elements;
    };

    return (
        <p style={style} data-id={id}>
            {renderTextWithHighlights()}
        </p>
    );
};
