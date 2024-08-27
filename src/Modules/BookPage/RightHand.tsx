import { useState } from "react";
import Notes from "./Notes";
import Settings from "./Settings";
import { Note } from "./MainPage";

type RightHandProps = {
    notes: Note[];
};

export default function RightHand({ notes }: RightHandProps) {
    const [selected, setSelected] = useState<"notes" | "settings">("notes");

    const allItems = {
        notes: Notes,
        settings: Settings,
    };
    const SelectedItem = allItems[selected];

    return (
        <div className="flex flex-col w-96 bg-zinc-900 text-gray-300">
            <div className="border-b border-gray-700 flex flex-row h-12 w-full items-center">
                <button
                    className={`p-4 ${
                        selected === "notes" ? "text-gray-300" : "text-gray-500"
                    }`}
                    onClick={() => setSelected("notes")}
                >
                    Notes
                </button>
                <button
                    className={`p-4 ${
                        selected === "settings"
                            ? "text-gray-300"
                            : "text-gray-500"
                    }`}
                    onClick={() => setSelected("settings")}
                >
                    Settings
                </button>
            </div>
            <div className="p-4">
                <SelectedItem notes={notes} />
            </div>
        </div>
    );
}
