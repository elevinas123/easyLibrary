import { load } from "cheerio";
import JSZip from "jszip";

export async function extractToc(
    zip: JSZip,
    opfFilePath: string
): Promise<{ title: string; href: string; id: string }[]> {
    const opfContent = await zip.file(opfFilePath)?.async("string");
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

async function parseEpub2Ncx(
    zip: JSZip,
    ncxFilePath: string
): Promise<{ title: string; href: string; id: string }[]> {
    const ncxContent = await zip.file(ncxFilePath)?.async("string");
    const $ncx = load(ncxContent, { xmlMode: true });

    const toc = [];
    $ncx("navMap > navPoint").each((_, navPoint) => {
        const href = $ncx(navPoint).find("content").attr("src");
        const id = href?.split("#")[1] || "";
        toc.push({
            title: $ncx(navPoint).find("navLabel > text").text(),
            href,
            id,
        });
    });
    return toc;
}

async function parseEpub3Nav(
    zip: JSZip,
    navFilePath: string
): Promise<{ title: string; href: string; id: string }[]> {
    const navContent = await zip.file(navFilePath)?.async("string");
    const $nav = load(navContent, { xmlMode: true });

    const toc = [];
    $nav('nav[epub\\:type="toc"] ol > li').each((_, listItem) => {
        const href = $nav(listItem).find("a").attr("href");
        const id = href?.split("#")[1] || "";
        toc.push({
            title: $nav(listItem).find("a").text(),
            href,
            id,
        });
    });
    return toc;
}
