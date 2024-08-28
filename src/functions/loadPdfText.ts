import Tesseract from "tesseract.js";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { createCanvas } from "canvas";

GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export const loadPdfText = async (url: string) => {
    // Load the PDF document
    const loadingTask = getDocument(url);
    const pdf = await loadingTask.promise;
    console.log("PDF loaded", pdf);

    let extractedData: Tesseract.Page[] = [];

    // Create and initialize the Tesseract.js worker
    const worker = await Tesseract.createWorker(); // createWorker() returns a promise, but no need to await here

    for (let i = 4;  i<=16;  i++) {
        try {
            const page = await pdf.getPage(i);
            console.log(`Page ${i} loaded`, page);

            // Create a canvas and render the page
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = createCanvas(viewport.width, viewport.height);
            const context = canvas.getContext("2d");
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };

            await page.render(renderContext).promise;
            const image = canvas.toDataURL("image/png");

            // Use Tesseract.js to recognize text from the image
            const {data} = await worker.recognize(image);
     

            console.log(`Processed text for page ${i}`, data);

            extractedData.push(data);
        } catch (pageError) {
            console.error(`Error processing page ${i}:`, pageError);
        }
    }

    await worker.terminate();

    // Return the extracted text with type properties
    console.log("extractedText", extractedData);
    return extractedData;
};
