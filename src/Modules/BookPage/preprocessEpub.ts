import { Cheerio, load } from "cheerio";

export type HighlightRange = {
    startElementId: string;
    startOffset: number;
    endElementId: string;
    endOffset: number;
    highlightedText: string; // Optional, for debugging
    intermediateElementIds?: string[]; // New field to store IDs of elements in between
    highlightId: string
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
export type HtmlElementObject = {
    type: string; // The tag name of the element (e.g., 'p', 'h1', 'div', etc.)
    id: string;
    text: string; // Store the full text of the element
    highlights: HighlightRange[]; // Store highlighted ranges within the text
    style?: React.CSSProperties;
};
export type HtmlObject = {
    type: "html";
    elements: HtmlElementObject[]; // Use the new generic HtmlElementObject type
};
export const preprocessEpub = (epub: string[]): (HtmlObject | null)[] => {
    return epub.map((pages, index) => parseHtmlToObjects(pages, index));
};

export const parseHtmlToObjects = (
    html: string,
    paragraphIndex: number
): HtmlObject | null => {
    const $ = load(html);

    const parseElementText = (element: cheerio.Element): string => {
        if (element.type === "text") {
            return element.data || "";
        } else if (element.type === "tag") {
            return $(element)
                .contents()
                .map((_, child) => parseElementText(child))
                .get()
                .join("");
        }
        return "";
    };

    const elements: HtmlElementObject[] = $("body")
        .children()
        .map((index, elem) => {
            const textContent = parseElementText(elem);
            return {
                type: elem.tagName,
                id: `${elem.tagName}-${paragraphIndex}-${index}`,
                text: textContent,
                highlights: [], // Initialize with no highlights
                style: $(elem).attr("style")
                    ? JSON.parse($(elem).attr("style") || "{}")
                    : undefined, // Convert inline style to object
            } as HtmlElementObject;
        })
        .get();

    return {
        type: "html",
        elements,
    } as HtmlObject;
};

