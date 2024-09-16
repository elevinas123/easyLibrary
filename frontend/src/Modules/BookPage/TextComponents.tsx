import React from "react";
import {
    HighlightRange,
    HtmlElementObject,
} from "../../preprocess/epub/preprocessEpub";

type HtmlElementProps = {
    element: HtmlElementObject;
    highlights: HighlightRange[];
};

export const HtmlElement: React.FC<HtmlElementProps> = ({
    element,
    highlights,
}) => {
    const renderTextWithHighlights = () => {
        const { text, id } = element;
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
                // Check if the current element is part of the highlight range
                const isStartElement = startElementId === id;
                const isEndElement = endElementId === id;
                const isIntermediateElement =
                    intermediateElementIds?.includes(id);

                if (isStartElement || isEndElement || isIntermediateElement) {
                    const highlightStart = isStartElement ? startOffset : 0;
                    const highlightEnd = isEndElement ? endOffset : text.length;

                    // Add unhighlighted text before the highlight starts
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

        return elements.length > 0 ? elements : text;
    };

    const Tag = element.type as keyof JSX.IntrinsicElements; // Dynamically set the tag name

    return (
        <Tag style={element.style} data-id={element.id} className="m-5" toc-id={element.tocId}>
            {renderTextWithHighlights()}
        </Tag>
    );
};
