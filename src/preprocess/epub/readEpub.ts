import JSZip from "jszip";
import cheerio from "cheerio";

export async function extractToc(
    zip: JSZip,
    opfFilePath: string
): Promise<any[]> {
    const opfContent = await zip.file(opfFilePath)?.async("string");
    const $opf = cheerio.load(opfContent, { xmlMode: true });

    // Check for EPUB 3 Navigation Document
    let tocFilePath = $opf('item[properties="nav"]').attr("href");
    if (tocFilePath) {
        return await parseEpub3Nav(zip, tocFilePath);
    }

    // Fallback to EPUB 2 NCX
    const ncxItemId = $opf("spine").attr("toc");
    tocFilePath = $opf(`item[id="${ncxItemId}"]`).attr("href");
    if (tocFilePath) {
        return await parseEpub2Ncx(zip, tocFilePath);
    }

    throw new Error("No valid ToC found in the EPUB.");
}

async function parseEpub2Ncx(zip: JSZip, ncxFilePath: string): Promise<any[]> {
    const ncxContent = await zip.file(ncxFilePath)?.async("string");
    const $ncx = cheerio.load(ncxContent, { xmlMode: true });

    const toc = [];
    $ncx("navMap > navPoint").each((_, navPoint) => {
        toc.push({
            title: $ncx(navPoint).find("navLabel > text").text(),
            href: $ncx(navPoint).find("content").attr("src"),
            children: parseNcxSubpoints($ncx, navPoint),
        });
    });
    return toc;
}

function parseNcxSubpoints($ncx, navPoint): any[] {
    const subpoints = [];
    $ncx(navPoint)
        .find("navPoint")
        .each((_, subNavPoint) => {
            subpoints.push({
                title: $ncx(subNavPoint).find("navLabel > text").text(),
                href: $ncx(subNavPoint).find("content").attr("src"),
            });
        });
    return subpoints;
}

async function parseEpub3Nav(zip: JSZip, navFilePath: string): Promise<any[]> {
    const navContent = await zip.file(navFilePath)?.async("string");
    const $nav = cheerio.load(navContent, { xmlMode: true });

    const toc = [];
    $nav('nav[epub\\:type="toc"] ol > li').each((_, listItem) => {
        toc.push({
            title: $nav(listItem).find("a").text(),
            href: $nav(listItem).find("a").attr("href"),
            children: parseNavSubitems($nav, listItem),
        });
    });
    return toc;
}

function parseNavSubitems($nav, listItem): any[] {
    const subitems = [];
    $nav(listItem)
        .find("ol > li")
        .each((_, subListItem) => {
            subitems.push({
                title: $nav(subListItem).find("a").text(),
                href: $nav(subListItem).find("a").attr("href"),
            });
        });
    return subitems;
}


export async function loadToc(file: File) {
    const zip = await JSZip.loadAsync(file);
    const opfFilePath = await findOpfFilePath(zip);
    const toc = await extractToc(zip, opfFilePath);
    console.log(toc);
}
