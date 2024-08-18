import { useState } from "react";
import Notes from "./Notes";
import Settings from "./Settings";

export default function RightHand() {
    const [selected, setSelected] = useState<"notes"| "settings">("notes");

    const allItems = {
        "notes": Notes,
        "settings": Settings
    }
    const SelectedItem = allItems[selected]

    return (
        <div className="flex flex-col w-72 bg-zinc-900">
            <div className="border-b flex flex-row h-12 w-full items-center">
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
                <SelectedItem />
            </div>
        </div>
    );
}
