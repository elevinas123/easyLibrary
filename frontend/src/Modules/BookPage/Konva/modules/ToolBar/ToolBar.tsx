// ToolBar.tsx

import { FaTrash } from "react-icons/fa";
import ToolBarItem from "./ToolBarItem";
import { useAtom } from "jotai";
import { arrowsAtom, CanvaElement, canvaElementsAtom } from "../../konvaAtoms";
import { toolbarConfig } from "./ToolBar.config";
<<<<<<< HEAD
import { ArrowElement } from "../../../../../endPointTypes/types";
=======
import {
    ArrowElementType,
    CanvaElementType,
} from "../../../../../endPointTypes/types";
>>>>>>> MongooseBackend

type ToolBarProps = {
    selectedItemsIds: string[];
};

export default function ToolBar({ selectedItemsIds }: ToolBarProps) {
    const [canvaElements, setCanvaElements] = useAtom(canvaElementsAtom);
    const [arrows, setArrows] = useAtom(arrowsAtom);
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

<<<<<<< HEAD
    let controlShape: CanvaElement | ArrowElement | undefined =
=======
    let controlShape: CanvaElementType | ArrowElementType | undefined =
>>>>>>> MongooseBackend
        canvaElements.find((element) => element.id === selectedItemsIds[0]);
    if (!controlShape)
        controlShape = arrows.find(
            (element) => element.id === selectedItemsIds[0]
        );

    if (!selectedItemsIds.length || !controlShape) {
        return null;
    }

    // Get the toolbar controls based on the element type
    const controls = toolbarConfig[controlShape.type] || [];

    return (
        <div className="absolute left-4 top-4 z-50 p-4 bg-zinc-900 border border-zinc-700 rounded shadow-lg max-w-xs space-y-4">
            {controls.map((controlGroup) => (
                <div key={controlGroup.groupName}>
                    <h3 className="text-sm font-semibold mb-2">
                        {controlGroup.groupName}
                    </h3>
                    <div className="space-y-4">
                        {controlGroup.controls.map((control) => (
                            <ToolBarItem
                                key={control.property}
                                property={control.property}
                                label={control.label}
                                controlItem={
                                    (controlShape as any)[control.property]
                                }
                                updateItems={updateItems}
                                controlType={control.type}
                                options={control.options}
                            />
                        ))}
                    </div>
                </div>
            ))}

            {/* Actions */}
            <div>
                <h3 className="text-sm font-semibold mb-2">Actions</h3>
                <div className="flex space-x-2">
                    <button
                        className="w-8 h-8 flex justify-center items-center rounded bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => {
                            setCanvaElements((elements) =>
                                elements.filter(
                                    (element) =>
                                        !selectedItemsIds.includes(element.id)
                                )
                            );
                        }}
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    );
}
