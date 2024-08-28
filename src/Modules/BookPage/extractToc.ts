import { load } from "cheerio";
import JSZip from "jszip";
import { HtmlElementObject, HtmlObject } from "./preprocessEpub";

export async function extractToc(
    zip: JSZip,
    opfFilePath: string,
    preprocessedEpub: HtmlObject[]
): Promise<{ title: string; href: string; id: string }[]> {
    const opfContent = await zip.file(opfFilePath)?.async("string");
    const $opf = load(opfContent, { xmlMode: true });

    // EPUB 3 Navigation Document
    let tocFilePath = $opf('item[properties="nav"]').attr("href");
    if (tocFilePath) {
        return await parseEpub3Nav(zip, tocFilePath, preprocessedEpub);
    }

    // EPUB 2 NCX
    const ncxItemId = $opf("spine").attr("toc");
    tocFilePath = $opf(`item[id="${ncxItemId}"]`).attr("href");
    if (tocFilePath) {
        return await parseEpub2Ncx(zip, tocFilePath, preprocessedEpub);
    }

    throw new Error("No valid ToC found in the EPUB.");
}

async function parseEpub2Ncx(
    zip: JSZip,
    ncxFilePath: string,
    preprocessedEpub: HtmlObject[]
): Promise<{ title: string; href: string; id: string }[]> {
    const ncxContent = await zip.file(ncxFilePath)?.async("string");
    const $ncx = load(ncxContent, { xmlMode: true });

    const toc = [];
    $ncx("navMap > navPoint").each((_, navPoint) => {
        const href = $ncx(navPoint).find("content").attr("src");
        const [file, fragment] = href?.split("#") || [href, ""];

        // Find the element in the preprocessed content that matches the fragment
        const matchingElement = findElementByFragment(
            preprocessedEpub,
            fragment
        );

        if (matchingElement) {
            toc.push({
                title: $ncx(navPoint).find("navLabel > text").text(),
                href,
                id: matchingElement.id, // Use the actual element's ID
            });
        } else {
            console.warn(`No matching element found for fragment: ${fragment}`);
        }
    });
    return toc;
}

async function parseEpub3Nav(
    zip: JSZip,
    navFilePath: string,
    preprocessedEpub: HtmlObject[]
): Promise<{ title: string; href: string; id: string }[]> {
    const navContent = await zip.file(navFilePath)?.async("string");
    const $nav = load(navContent, { xmlMode: true });

    const toc = [];
    $nav('nav[epub\\:type="toc"] ol > li').each((_, listItem) => {
        const href = $nav(listItem).find("a").attr("href");
        const [file, fragment] = href?.split("#") || [href, ""];

        // Find the element in the preprocessed content that matches the fragment
        const matchingElement = findElementByFragment(
            preprocessedEpub,
            fragment
        );

        if (matchingElement) {
            toc.push({
                title: $nav(listItem).find("a").text(),
                href,
                id: matchingElement.id, // Use the actual element's ID
            });
        } else {
            console.warn(`No matching element found for fragment: ${fragment}`);
        }
    });
    return toc;
}

function findElementByFragment(
    preprocessedEpub: HtmlObject[],
    fragment: string
): HtmlElementObject | null {
    if (!fragment) return null;

    for (const htmlObject of preprocessedEpub) {
        const matchingElement = htmlObject.elements.find(
            (elem) => elem.id === fragment
        );
        if (matchingElement) return matchingElement;
    }

    return null;
}
