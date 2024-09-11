import { HtmlObject } from "../../preprocess/epub/preprocessEpub";
import { Note } from "./MainPage";
import KonvaStage from "./Konva/KonvaStage";

type TextProps = {
    bookElements: (HtmlObject | null)[];
    fontSize: number;

    createNote: (note: Note) => void;
};

export default function Text({ bookElements }: TextProps) {
    return (
        <div className="w-full flex flex-col items-center relative h-screen overflow-y-scroll custom-scrollbar">
                <KonvaStage bookElements={bookElements} />
        </div>
    );
}
