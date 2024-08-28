import { Chapter } from "./MainPage"; // Assuming you have the Chapter type defined elsewhere

type ChaptersProps = {
    chapters: Chapter[];
};

export default function Chapters({ chapters }: ChaptersProps) {
    const handleChapterClick = (chapterId: string) => {
        const targetElement = document.querySelector(
            `[data-id='${chapterId}']`
        );
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            targetElement.focus({ preventScroll: true }); // Ensure it is focused after scroll
        }
    };

    return (
        <div className="flex flex-col w-96 bg-zinc-900 border-l border-gray-700">
            <div className="border-b border-gray-700 flex flex-row h-12 w-full items-center justify-between px-4">
                <button className="text-gray-300 hover:text-gray-500">
                    Back
                </button>
                <button className="text-gray-300 hover:text-gray-500">
                    Close
                </button>
            </div>
            <div className="p-4 text-gray-300 overflow-y-auto">
                <div className="text-lg font-semibold mb-2">
                    Table of Contents
                </div>
                <ul className="space-y-2">
                    {chapters.map((chapter, index) => (
                        <li key={index}>
                            <div
                                className={`hover:text-gray-400 cursor-pointer`}
                                style={{
                                    marginLeft: `${chapter.indentLevel * 20}px`,
                                }}
                                onClick={() => handleChapterClick(chapter.id)}
                            >
                                {chapter.title}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}