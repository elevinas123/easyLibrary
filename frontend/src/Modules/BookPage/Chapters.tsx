import { Button } from "../../components/ui/button";
import { ChaptersDataType } from "../../../../backend/src/book/schema/chaptersData/chaptersData.schema";

type ChaptersProps = {
    chapters: ChaptersDataType[];
    handleChapterClick: (chapterId: string) => void;
};

export default function Chapters({
    chapters,
    handleChapterClick,
}: ChaptersProps) {
    return (
        <div className="flex flex-col w-96 bg-zinc-900 border-l border-gray-700 h-screen ">
            <div className="border-b border-gray-700 flex flex-row h-12 w-full items-center justify-between px-4">
                <Button className="hover:text-gray-400">Back</Button>
                <Button className="hover:text-gray-400">Close</Button>
            </div>
            <div className="p-4  overflow-y-scroll custom-scrollbar">
                <div className="text-lg font-semibold mb-2">
                    Table of Contents
                </div>
                <ul className="space-y-2 text-gray-500">
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
