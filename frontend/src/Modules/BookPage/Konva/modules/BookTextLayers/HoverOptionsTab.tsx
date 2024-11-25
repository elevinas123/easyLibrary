import { useAtom } from "jotai";
import { highlightOptionsAtom } from "../../konvaAtoms";

type HoverOptionsTabProps = {
    // Define your prop types here
};

export default function HoverOptionsTab({}: HoverOptionsTabProps) {
    const [highlightOptions] = useAtom(highlightOptionsAtom);
    return (
        <div className="absolute z-50">
            {highlightOptions.active ? (
                <div className="bg-white rounded-lg shadow-lg">
                    <div className="p-2">Highlight</div>
                    <div className="p-2">Comment</div>
                </div>
            ) : null}
        </div>
    );
}
