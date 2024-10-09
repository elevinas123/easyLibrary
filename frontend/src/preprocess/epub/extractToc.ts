import { load, CheerioAPI } from "cheerio";
import JSZip from "jszip";
import type { Element } from "domhandler";
export type Toc = {
    title: string;
    href: string | undefined;
    id: string;
    playOrder?: string; // Optional: useful for ordering or other metadata
    children?: Toc[]; // Optional: to support hierarchical ToCs
};

export async function extractToc(
    zip: JSZip,
    opfFilePath: string
): Promise<Toc[]> {
    const opfContent = await zip.file(opfFilePath)?.async("string");
    if (!opfContent) {
        throw new Error("OPF file must be present");
    }
    const $opf = load(opfContent, { xmlMode: true });

    // EPUB 3 Navigation Document
    let tocFilePath = $opf('item[properties="nav"]').attr("href");
    if (tocFilePath) {
        return await parseEpub3Nav(zip, tocFilePath);
    }

    // EPUB 2 NCX
    const ncxItemId = $opf("spine").attr("toc");
    tocFilePath = $opf(`item[id="${ncxItemId}"]`).attr("href");
    if (tocFilePath) {
        return await parseEpub2Ncx(zip, tocFilePath);
    }

    throw new Error("No valid ToC found in the EPUB.");
}

async function parseEpub2Ncx(zip: JSZip, ncxFilePath: string): Promise<Toc[]> {
    const ncxContent = await zip.file(ncxFilePath)?.async("string");
    if (!ncxContent) {
        throw new Error("NCX file must be present");
    }
    const $ncx = load(ncxContent, { xmlMode: true });
    const toc: Toc[] = [];

    $ncx("navMap > navPoint").each((_, navPoint) => {
        const href = $ncx(navPoint).find("content").attr("src");
        const id = href?.split("#")[1] || "";
        const playOrder = $ncx(navPoint).attr("playOrder");
        const title = $ncx(navPoint).find("navLabel > text").text();

        // Recursively parse children if they exist
        const children: Toc[] = parseNcxChildren($ncx, navPoint);

        toc.push({
            title,
            href,
            id,
            playOrder,
            children: children.length > 0 ? children : undefined,
        });
    });
    return toc;
}

function parseNcxChildren($: CheerioAPI, navPoint: Element): Toc[] {
    const children: Toc[] = [];
    $(navPoint)
        .find("navPoint")
        .each((_, child) => {
            const href = $(child).find("content").attr("src");
            const id = href?.split("#")[1] || "";
            const playOrder = $(child).attr("playOrder");
            const title = $(child).find("navLabel > text").text();

            children.push({
                title,
                href,
                id,
                playOrder,
                children: parseNcxChildren($, child),
            });
        });
    return children;
}

async function parseEpub3Nav(zip: JSZip, navFilePath: string): Promise<Toc[]> {
    const navContent = await zip.file(navFilePath)?.async("string");
    if (!navContent) {
        throw new Error("Navigation file must be present");
    }
    const $nav = load(navContent, { xmlMode: true });

    const toc: Toc[] = [];
    $nav('nav[epub\\:type="toc"] ol > li').each((_, listItem) => {
        const href = $nav(listItem).find("a").attr("href");
        const id = href?.split("#")[1] || "";
        const title = $nav(listItem).find("a").text();

        // Recursively parse children if they exist
        const children: Toc[] = parseNavChildren($nav, listItem);

        toc.push({
            title,
            href,
            id,
            children: children.length > 0 ? children : undefined,
        });
    });
    return toc;
}
function parseNavChildren($: CheerioAPI, listItem: Element): Toc[] {
    const children: Toc[] = [];
    $(listItem)
        .find("ol > li")
        .each((_, child) => {
            const href = $(child).find("a").attr("href");
            const fragment = href?.split("#")[1] || "";
            const title = $(child).find("a").text();

            children.push({
                title,
                href,
                id: fragment,
                children: parseNavChildren($, child),
            });
        });
    return children;
}
