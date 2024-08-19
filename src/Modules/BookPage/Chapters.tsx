export default function Chapters() {
    const chapters = [
        {
            title: "Chapter 1",
            subchapters: ["Subchapter 1.1", "Subchapter 1.2"],
        },
        {
            title: "Chapter 2",
            subchapters: ["Subchapter 2.1", "Subchapter 2.2"],
        },
        {
            title: "Chapter 3",
            subchapters: [],
        },
        {
            title: "Chapter 4",
            subchapters: ["Subchapter 4.1"],
        },
    ];

    return (
        <div className="flex flex-col w-72 bg-zinc-900">
            <div className="border-b flex flex-row h-12 w-full items-center justify-between px-4">
                <button className="text-gray-300 hover:text-gray-500">
                    Back
                </button>
                <button className="text-gray-300 hover:text-gray-500">
                    Close
                </button>
            </div>
            <div className="p-4 text-gray-300">
                <div className="text-lg font-semibold">Title</div>
                <div className="mt-4">
                    <ul className="mt-2 space-y-2">
                        {chapters.map((chapter, index) => (
                            <li key={index}>
                                <div className="hover:text-gray-500 cursor-pointer">
                                    {chapter.title}
                                </div>
                                {chapter.subchapters.length > 0 && (
                                    <ul className="mt-1 ml-4 space-y-1">
                                        {chapter.subchapters.map(
                                            (subchapter, subIndex) => (
                                                <li
                                                    key={subIndex}
                                                    className="hover:text-gray-500 cursor-pointer"
                                                >
                                                    {subchapter}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
