import { Cheerio, load } from "cheerio";

export type HighlightRange = {
    startElementId: string;
    startOffset: number;
    endElementId: string;
    endOffset: number;
    highlightedText: string; // Optional, for debugging
    intermediateElementIds?: string[]; // New field to store IDs of elements in between
};


export type ParagraphObject = {
    type: "paragraph";
    id: string;
    text: string; // Store the full text of the paragraph
    highlights: HighlightRange[]; // Store highlighted ranges within the text
    style?: React.CSSProperties;
};

export type HeadingObject = {
    type: "heading";
    id: string;
    tagName: string;
    text: string; // Store the full text of the heading
    style?: React.CSSProperties;
};

export type HtmlObject = {
    type: "html";
    elements: (ParagraphObject | HeadingObject)[];
};

export const preprocessEpub = (epub: string[]): (HtmlObject | null)[] => {
    return epub.map((pages, index) => parseHtmlToObjects(pages, index));
};

export const parseHtmlToObjects = (
    html: string,
    paragraphIndex: number
): HtmlObject | null => {
    if (paragraphIndex > 10) return null; // Limiting to first 10 paragraphs as per original code
    const $ = load(html);

    const parseElementText = (element: cheerio.Element): string => {
        if (element.type === "text") {
            return element.data || "";
        } else if (element.type === "tag") {
            if (element.tagName === "span") {
                // Handle styled text within spans
                return $(element).text();
            } else {
                // Handle other tags as nested children
                return $(element)
                    .contents()
                    .map((_, child) => parseElementText(child))
                    .get()
                    .join("");
            }
        }
        return "";
    };

    const elements: (ParagraphObject | HeadingObject)[] = $("body")
        .children()
        .map((_, elem) => {
            const textContent = parseElementText(elem);
            if (elem.tagName === "p") {
                return {
                    type: "paragraph",
                    id: `paragraph-${paragraphIndex}-${_}`,
                    text: textContent,
                    highlights: [], // Initialize with no highlights
                } as ParagraphObject;
            } else if (elem.tagName.match(/^h[1-6]$/)) {
                return {
                    type: "heading",
                    id: `heading-${paragraphIndex}-${_}`,
                    tagName: elem.tagName,
                    text: textContent,
                } as HeadingObject;
            }
        })
        .get();

    return {
        type: "html",
        elements,
    } as HtmlObject;
};

