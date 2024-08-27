import { load } from "cheerio";

export type CharObject = {
    char: string;
    id: string;
    isHighlighted: boolean;
};

export type StyledTextObject = {
    type: "styledText";
    id: string;
    text: CharObject[];
    style: React.CSSProperties;
};

export type ParagraphObject = {
    type: "paragraph";
    id: string;
    children: (CharObject | StyledTextObject)[];
};

export type HeadingObject = {
    type: "heading";
    id: string;
    tagName: string;
    children: (CharObject | StyledTextObject)[];
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
    if (paragraphIndex > 10) return null; // Limiting to first 5 paragraphs as per original code
    const $ = load(html);
    let charIndex = 0; // Reset charIndex for each paragraph

    const parseElement = (
        element: cheerio.Element
    ): (CharObject | StyledTextObject)[] => {
        if (element.type === "text") {
            return element.data!.split("").map((char, i) => {
                const id = `char-${paragraphIndex}-${charIndex++}`;
                return {
                    char,
                    id,
                    isHighlighted: false, // You can update this based on your logic
                } as CharObject;
            });
        } else if (element.type === "tag") {
            if (element.tagName === "span") {
                const style = parseStyleString($(element).attr("style") || "");
                const text = $(element)
                    .text()
                    .split("")
                    .map((char) => {
                        const id = `char-${paragraphIndex}-${charIndex++}`;
                        return {
                            char,
                            id,
                            isHighlighted: false, // You can update this based on your logic
                        } as CharObject;
                    });
                return [
                    {
                        type: "styledText",
                        id: `span-${paragraphIndex}-${charIndex}`,
                        text,
                        style,
                    } as StyledTextObject,
                ];
            } else {
                // Handle other tags as nested children
                return $(element)
                    .contents()
                    .map((_, child) => parseElement(child))
                    .get()
                    .flat();
            }
        }
        return [];
    };

    const elements: (ParagraphObject | HeadingObject)[] = $("body")
        .children()
        .map((_, elem) => {
            if (elem.tagName === "p") {
                const children = parseElement(elem);
                return {
                    type: "paragraph",
                    id: `paragraph-${paragraphIndex}-${charIndex}`,
                    children,
                } as ParagraphObject;
            } else if (elem.tagName.match(/^h[1-6]$/)) {
                const children = parseElement(elem);
                return {
                    type: "heading",
                    id: `heading-${paragraphIndex}-${charIndex}`,
                    tagName: elem.tagName,
                    children,
                } as HeadingObject;
            }
        })
        .get();

    return {
        type: "html",
        elements,
    } as HtmlObject;
};

const parseStyleString = (styleString: string): React.CSSProperties => {
    const style: React.CSSProperties = {};
    const styles = styleString.split(";").filter(Boolean);
    styles.forEach((styleRule) => {
        const [key, value] = styleRule.split(":");
        if (key && value) {
            style[key.trim() as keyof React.CSSProperties] = value.trim();
        }
    });
    return style;
};
