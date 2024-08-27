import JSZip from "jszip";

export async function readEpub(file: File): Promise<string[]> {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const paragraphs: string[] = [];
    const fileNames = Object.keys(zip.files);

    for (const fileName of fileNames) {
        if (fileName.endsWith(".html") || fileName.endsWith(".xhtml")) {
            const fileData = await zip.file(fileName)?.async("string");
            if (fileData) {
                // You can further process the HTML content here
                paragraphs.push(fileData);
            }
        }
    }

    return paragraphs;
}
