import { load } from "cheerio";
import { readEpub } from "../../preprocess/epub/preprocessEpub";
import JSZip from "jszip";
import { useState } from "react";

type ImportBookProps = {
    // Define your prop types here
};

export default function ImportBook({ props }: ImportBookProps) {
    const [_, setError] = useState<string | null>(null);

    const handleEpubChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const epub = await readEpub(file);
                const preprocessedEpub = preprocessEpub(epub);

                // Extract ToC using preprocessed content
                const zip = await JSZip.loadAsync(file);
                const opfFilePath = await findOpfFilePath(zip);
                if (!opfFilePath) {
                    setError("Failed to load opfFilePath.");
                    return;
                }
                const toc = await extractToc(zip, opfFilePath);

                // Convert ToC to chapters data
                const chaptersData = toc.map((item) => ({
                    id: item.id, // This is now the correct ID of the element
                    title: item.title,
                    href: item.href,
                    indentLevel: calculateIndentLevel(item.href),
                }));

                setBookElements(preprocessedEpub);
                setChapters(chaptersData);

                console.log("preprocessedEpub", preprocessedEpub);
                console.log("chaptersData", chaptersData);
            } catch (error) {
                console.error("Failed to load EPUB", error);
                setError("Failed to load EPUB. Please try another file.");
            }
        }
    };
    function calculateIndentLevel(href: string | undefined) {
        if (!href) return null;
        // Simple example: increase indent level based on depth of href structure
        return (href.match(/\//g) || []).length;
    }

    async function findOpfFilePath(zip: JSZip) {
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

    return (
        <div>
            <input
                className="absolute left-1/2 z-10 bg-gray-500"
                type="file"
                placeholder="Select EPUB"
                accept=".epub"
                onChange={handleEpubChange}
            />
        </div>
    );
}
