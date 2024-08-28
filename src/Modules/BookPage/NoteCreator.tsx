import React, { useState } from "react";
import { HighlightRange } from "../../preprocess/epub/preprocessEpub";
import { v4 as uuidv4 } from "uuid";
import { Note } from "./MainPage";

type NoteCreatorProps = {
    highlight: HighlightRange;
    setNoteCreator: React.Dispatch<React.SetStateAction<false | JSX.Element>>;
    createNote: (note: Note) => void;
};

export default function NoteCreator({
    highlight,
    setNoteCreator,
    createNote,
}: NoteCreatorProps) {
    const [noteText, setNoteText] = useState<string>("");

    const handleSaveNote = () => {
        if (noteText.trim() === "") return;

        const newNote: Note = {
            noteText,
            noteId: uuidv4(), // Generate a unique ID for the note
            noteReference: highlight.highlightedText || "",
            noteReferenceIdRanges: highlight,
        };

        createNote(newNote);
        setNoteText(""); // Clear the input field
        setNoteCreator(false); // Close the note creator
    };

    return (
        <div className="bg-zinc-800 border-gray-500 border shadow-lg rounded-lg p-4 absolute top-10 left-10 w-80 z-50 text-gray-300">
            <div className="text-lg font-bold text-gray-100 mb-2">
                Add a Note
            </div>
            <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Type your note here..."
                className="w-full p-2 border text-white bg-zinc-700 border-zinc-600 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
            />
            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={() => setNoteCreator(false)}
                    className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSaveNote}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                    Save Note
                </button>
            </div>
        </div>
    );
}
