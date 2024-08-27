import { Note } from "./MainPage";

type RightHandProps = {
    notes: Note[];
};

export default function Notes({ notes }: RightHandProps) {
    return (
        <div className="w-full p-4 bg-zinc-900 rounded-lg text-gray-300">
            <h2 className="text-lg font-semibold mb-4">Notes</h2>
            {notes.length > 0 ? (
                <ul className="space-y-4">
                    {notes.map((note) => (
                        <li
                            key={note.noteId}
                            className="border-b border-gray-700 pb-2"
                        >
                            <div className="text-gray-400 text-sm">
                                <span className="font-bold">Reference:</span>{" "}
                                <span className="italic">
                                    {note.noteReference}
                                </span>
                            </div>
                            <div className="mt-2 text-gray-300">
                                {note.noteText}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-gray-500">No notes available.</div>
            )}
        </div>
    );
}
