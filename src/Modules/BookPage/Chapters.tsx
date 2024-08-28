import { Chapter } from "./MainPage";

type ChaptersProps = {
    chapters: Chapter[];
};

export default function Chapters({ chapters }: ChaptersProps) {
    const handleChapterClick = (chapterId: string) => {
        const targetElement = document.querySelector(`[toc-id='${chapterId}']`);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            targetElement.focus({ preventScroll: true }); // Ensure it is focused after scroll
        }
    };

    return (
        <div className="flex flex-col w-96 bg-zinc-900 border-l border-gray-700 h-screen ">
            <div className="border-b border-gray-700 flex flex-row h-12 w-full items-center justify-between px-4">
                <button className="text-gray-300 hover:text-gray-500">
                    Back
                </button>
                <button className="text-gray-300 hover:text-gray-500">
                    Close
                </button>
            </div>
            <div className="p-4 text-gray-500 overflow-y-scroll custom-scrollbar">
                <div className="text-lg font-semibold mb-2">
                    Table of Contents
                </div>
                <ul className="space-y-2">
                    {chapters.map((chapter, index) => (
                        <li key={index}>
                            <div
                                className={`hover:text-gray-300 transition-colors duration-100 cursor-pointer`}
                                style={{
                                    marginLeft: `${
                                        (chapter.indentLevel ?? 0) * 20
                                    }px`,
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
