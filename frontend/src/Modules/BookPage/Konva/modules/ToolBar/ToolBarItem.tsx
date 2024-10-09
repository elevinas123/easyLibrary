import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../../components/ui/select";
import ColorPicker from "./ColorPicker";
import SliderControl from "./SliderControl";

type ToolBarItemProps = {
    controlItem: string | number;
    updateItems: (property: { [key: string]: any }) => void;
    controlType: "color" | "number" | "text" | "select";
    options?: string[];
    property: string;
    label: string;
};

const ToolBarItem = ({
    controlItem,
    updateItems,
    controlType,
    options = [],
    property,
    label,
}: ToolBarItemProps) => {
    const handleChange = (value: any) => {
        updateItems({ [property]: value });
    };

    const predefinedColors = [
        "#000000",
        "#ffffff",
        "#e03131",
        "#2f9e44",
        "#1971c2",
        "#f08c00",
        "#ffc9c9",
        "#b2f2bb",
        "#a5d8ff",
        "#ffec99",
    ];

    return (
        <div className="space-y-2">
            <Label htmlFor={property}>{label}</Label>
            {controlType === "color" && (
                <ColorPicker
                    selectedColor={controlItem as string}
                    onChange={handleChange}
                    colors={predefinedColors}
                />
            )}
            {controlType === "number" && (
                <SliderControl
                    id={property}
                    min={0}
                    max={10}
                    step={0.1}
                    value={controlItem as number}
                    onChange={handleChange}
                />
            )}
            {controlType === "text" && (
                <Input
                    id={property}
                    type="text"
                    value={controlItem as string}
                    onChange={(e) => handleChange(e.target.value)}
                />
            )}
            {controlType === "select" && (
                <Select
                    value={controlItem as string}
                    onValueChange={handleChange}
                >
                    <SelectTrigger id={property}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option.charAt(0).toUpperCase() +
                                    option.slice(1)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
    );
};

export default ToolBarItem;
