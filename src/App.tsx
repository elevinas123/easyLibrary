import { useEffect, useState } from "react";

function App() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const loadingTask = pdfj.getDocument(url);
        loadingTask.promise.then((pdf) => {
            console.log("PDF loaded");

            // Fetch the first page
            pdf.getPage(1).then((page) => {
                console.log("Page loaded");

                page.getTextContent().then((textContent) => {
                    // Process the text content
                    textContent.items.forEach((item) => {
                        console.log(item.str);
                    });
                });
            });
        });
    }, [])
    return (
        <div className="bg-black text-gray-100 h-screen w-screen">Library</div>
    );
}

export default App;
