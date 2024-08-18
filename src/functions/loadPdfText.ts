import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
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
                    .join(" ");

                console.log(`Extracted text for page ${i}`, pageText);

                extractedText += pageText + "\n\n";
            } catch (pageError) {
                console.error(`Error processing page ${i}:`, pageError);
            }
        }
        return extractedText

};
