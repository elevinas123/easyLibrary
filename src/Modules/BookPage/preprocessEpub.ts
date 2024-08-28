import { load } from "cheerio";
import JSZip from "jszip";

export type HighlightRange = {
    startElementId: string;
    startOffset: number;
    endElementId: string;
    endOffset: number;
    highlightedText: string; // Optional, for debugging
    intermediateElementIds?: string[]; // New field to store IDs of elements in between
    highlightId: string;
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
    additionalId: string
    text: string; // Store the full text of the element
    highlights: HighlightRange[]; // Store highlighted ranges within the text
    style?: React.CSSProperties;
};
export type HtmlObject = {
    type: "html";
    elements: HtmlElementObject[]; // Use the new generic HtmlElementObject type
};
export async function readEpub(file: File): Promise<string[]> {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const opfFilePath = await findOpfFilePath(zip);
    if (!opfFilePath) {
        throw new Error("Unable to find content.opf file.");
    }

    const contentFiles = await parseOpfFile(zip, opfFilePath);

    const paragraphs: string[] = [];
    for (const file of contentFiles) {
        const fileData = await zip.file(file.href)?.async("string");
        if (fileData) {
            paragraphs.push(fileData);
        }
    }

    return paragraphs;
}

async function findOpfFilePath(zip: JSZip): Promise<string | null> {
    const containerXml = await zip
        .file("META-INF/container.xml")
        ?.async("string");
    if (containerXml) {
        const $ = load(containerXml, { xmlMode: true });
        const rootfileElement = $("rootfile");
        if (rootfileElement.length > 0) {
            return rootfileElement.attr("full-path") || null;
        }
    }
    return null;
}

async function parseOpfFile(
    zip: JSZip,
    opfFilePath: string
): Promise<{ id: string; href: string }[]> {
    const opfContent = await zip.file(opfFilePath)?.async("string");
    if (!opfContent) {
        throw new Error("Unable to read content.opf file.");
    }

    const $ = load(opfContent, { xmlMode: true });

    // Get the manifest items
    const manifestItems: Record<string, string> = {};
    $("manifest item").each((_, item) => {
        const id = $(item).attr("id");
        const href = $(item).attr("href");
        if (id && href) {
            manifestItems[id] = href;
        }
    });

    // Get the spine items in the correct order
    const spineItems = $("spine itemref")
        .map((_, itemref) => {
            const idref = $(itemref).attr("idref");
            if (idref && manifestItems[idref]) {
                return { id: idref, href: manifestItems[idref] };
            }
            throw new Error(`Spine references non-existent item: ${idref}`);
        })
        .get();

    return spineItems;
}

export function preprocessEpub(epub: string[]): HtmlObject[] {
    return epub.map((html, index) => {
        const $ = load(html);

        const elements: HtmlElementObject[] = $("body")
            .children()
            .map((i, elem) => {
                const textContent = $(elem).text();
                const id = `${elem.tagName}-${index}-${i}`;

                $(elem).attr("id", id); // Assign the id back to the element

                let additionalId = "";
                if (
                    elem.children.length > 1 &&
                    elem.children[0]?.name === "a" &&
                    elem.children[0]?.attribs.id
                ) {
                    additionalId = elem.children[0].attribs.id;
                }

                const isHeading = /^h[1-6]$/.test(elem.tagName);
                const isParagraph = elem.tagName === "p";

                if (isHeading || isParagraph) {
                    return {
                        type: elem.tagName,
                        id,
                        tagName: elem.tagName,
                        text: textContent,
                        additionalId: additionalId,
                        highlights: [],
                    } as HtmlElementObject;
                }

                return null;
            })
            .get()
            .filter(Boolean);

        return {
            type: "html",
            elements,
        };
    });
}
