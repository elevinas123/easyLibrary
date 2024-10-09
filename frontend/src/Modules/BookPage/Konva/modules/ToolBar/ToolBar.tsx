import { useState } from "react";

import { Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { useAtom } from "jotai";
import { arrowsAtom, canvaElementsAtom } from "../../konvaAtoms";
import { toolbarConfig } from "./ToolBar.config";
import {
    ArrowElementType,
    CanvaElementType,
} from "../../../../../endPointTypes/types";
import ToolBarItem from "./ToolBarItem";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../../../../components/ui/card";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../../../../../components/ui/collapsible";
import { Button } from "../../../../../components/ui/button";

type ToolBarProps = {
    selectedItemsIds: string[];
};

export default function ToolBar({ selectedItemsIds }: ToolBarProps) {
    const [canvaElements, setCanvaElements] = useAtom(canvaElementsAtom);
    const [arrows, setArrows] = useAtom(arrowsAtom);
    const [openGroups, setOpenGroups] = useState<string[]>([]);

    const updateItems = (property: { [key: string]: any }) => {
        setCanvaElements((elements) =>
            elements.map((element) =>
                selectedItemsIds.includes(element.id)
                    ? { ...element, ...property }
                    : element
            )
        );
        setArrows((elements) =>
            elements.map((element) =>
                selectedItemsIds.includes(element.id)
                    ? { ...element, ...property }
                    : element
            )
        );
    };

    let controlShape: CanvaElementType | ArrowElementType | undefined =
        canvaElements.find((element) => element.id === selectedItemsIds[0]);
    if (!controlShape)
        controlShape = arrows.find(
            (element) => element.id === selectedItemsIds[0]
        );

    if (!selectedItemsIds.length || !controlShape) {
        return null;
    }

    const controls = toolbarConfig[controlShape.type] || [];

    const toggleGroup = (groupName: string) => {
        setOpenGroups((prev) =>
            prev.includes(groupName)
                ? prev.filter((g) => g !== groupName)
                : [...prev, groupName]
        );
    };

    return (
        <Card className="absolute left-4 top-4 z-50 w-64 bg-card text-card-foreground">
            <CardHeader className="p-4">
                <CardTitle className="text-lg font-semibold">
                    Element Properties
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-12rem)]">
                    {controls.map((controlGroup) => (
                        <Collapsible
                            key={controlGroup.groupName}
                            open={openGroups.includes(controlGroup.groupName)}
                            onOpenChange={() =>
                                toggleGroup(controlGroup.groupName)
                            }
                        >
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between p-4"
                                >
                                    {controlGroup.groupName}
                                    {openGroups.includes(
                                        controlGroup.groupName
                                    ) ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="p-4 space-y-4">
                                {controlGroup.controls.map((control) => (
                                    <ToolBarItem
                                        key={control.property}
                                        property={control.property}
                                        label={control.label}
                                        controlItem={
                                            (controlShape as any)[
                                                control.property
                                            ]
                                        }
                                        updateItems={updateItems}
                                        controlType={control.type}
                                        options={control.options}
                                    />
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </ScrollArea>
                <div className="p-4 border-t">
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                            setCanvaElements((elements) =>
                                elements.filter(
                                    (element) =>
                                        !selectedItemsIds.includes(element.id)
                                )
                            );
                        }}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Element
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
