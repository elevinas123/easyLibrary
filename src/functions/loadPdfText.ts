import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { removeExtraWhitespace } from "../Modules/BookPage/functions/preprocessText";
GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export const loadPdfText = async (url: string) => {
        // Assuming the PDF is located in the public directory
        const loadingTask = getDocument(url);

        const pdf = await loadingTask.promise;
        console.log("PDF loaded", pdf);

        let extractedText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            try {
                const page = await pdf.getPage(i);
                console.log(`Page ${i} loaded`, page);

                const textContent = await page.getTextContent();
                console.log(`Text content for page ${i}`, textContent);

                const pageText = textContent.items
                    .map((item) => item.str)
                    .join("");
                const precessedPageText = removeExtraWhitespace(pageText)
                console.log(`Extracted text for page ${i}`, precessedPageText);

                extractedText += removeExtraWhitespace(precessedPageText);
            } catch (pageError) {
                console.error(`Error processing page ${i}:`, pageError);
            }
        }
        return extractedText

};
