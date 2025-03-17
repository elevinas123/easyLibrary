import { useAtom } from "jotai";
import { activeToolAtom } from "../konvaAtoms";

import {
    Hand,
    MousePointer,
    Square,
    Diamond,
    Circle,
    ArrowRight,
    Minus,
    Pipette,
    Type,
    Image,
    Eraser,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "../../../../components/ui/button";

export type DrawingToolNames =
    | "Pan"
    | "Select"
    | "Rectangle"
    | "Circle"
    | "Arrow"
    | "Text"

type DrawingTool = {
    name: DrawingToolNames;
    icon: JSX.Element;
};

export default function Tools() {
    const [activeTool, setActiveTool] = useAtom(activeToolAtom);

    const activateTool = (tool: DrawingToolNames) => {
        setActiveTool(tool);
        console.log(`${tool} tool activated`);
    };

    const tools: DrawingTool[] = [
        { name: "Pan", icon: <Hand size={20} /> },
        { name: "Select", icon: <MousePointer size={20} /> },
        { name: "Rectangle", icon: <Square size={20} /> },
        { name: "Circle", icon: <Circle size={20} /> },
        { name: "Arrow", icon: <ArrowRight size={20} /> },
        { name: "Text", icon: <Type size={20} /> },
    ];

    return (
        <TooltipProvider>
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-card text-card-foreground rounded-lg shadow-lg p-2">
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex space-x-1">
                            {tools.map((tool) => (
                                <Tooltip key={tool.name}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant={
                                                activeTool === tool.name
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            size="icon"
                                            onClick={() =>
                                                activateTool(tool.name)
                                            }
                                            className="w-10 h-10"
                                        >
                                            {tool.icon}
                                            <span className="sr-only">
                                                {tool.name}
                                            </span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" >
                                        <p className="text-gray-300 mt-2">{tool.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </TooltipProvider>
    );
}
