// RightHand.tsx

import { useState } from "react";
import Notes from "./Notes";
import Settings from "./Settings";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs";

export default function RightHand() {
    const [selected, setSelected] = useState<"notes" | "settings">("notes");

    return (
        <div className="flex flex-col w-96 bg-white border-l border-gray-200 h-screen">
            <Tabs
                value={selected}
                onValueChange={(value) =>
                    setSelected(value as "notes" | "settings")
                }
                className="flex flex-col h-full"
            >
                <TabsList className="flex-shrink-0">
                    <TabsTrigger value="notes" className="flex-1">
                        Notes
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex-1">
                        Settings
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="notes" className="flex-grow overflow-auto">
                    <Notes />
                </TabsContent>
                <TabsContent
                    value="settings"
                    className="flex-grow overflow-auto p-4"
                >
                    <Settings />
                </TabsContent>
            </Tabs>
        </div>
    );
}
