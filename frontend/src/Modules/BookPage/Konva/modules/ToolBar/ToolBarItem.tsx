import { motion } from "framer-motion";
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
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { Check, ChevronDown } from "lucide-react";

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
        <div className="space-y-1.5">
            <Label htmlFor={property} className="text-xs font-medium">{label}</Label>
            
            {controlType === "color" && (
                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <div className="flex items-center gap-2">
                                <div 
                                    className="h-4 w-4 rounded-full" 
                                    style={{ backgroundColor: controlItem as string }}
                                />
                                <span>{controlItem as string}</span>
                            </div>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" align="start">
                        <ColorPicker
                            selectedColor={controlItem as string}
                            onChange={handleChange}
                            colors={predefinedColors}
                        />
                    </PopoverContent>
                </Popover>
            )}
            
            {controlType === "number" && (
                <div className="flex flex-col gap-1">
                    <SliderControl
                        id={property}
                        min={0}
                        max={10}
                        step={0.1}
                        value={controlItem as number}
                        onChange={handleChange}
                    />
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">0</span>
                        <Input
                            id={`${property}-input`}
                            type="number"
                            value={controlItem as number}
                            onChange={(e) => handleChange(parseFloat(e.target.value))}
                            className="h-7 w-16 text-xs"
                        />
                        <span className="text-xs text-muted-foreground">10</span>
                    </div>
                </div>
            )}
            
            {controlType === "text" && (
                <Input
                    id={property}
                    type="text"
                    value={controlItem as string}
                    onChange={(e) => handleChange(e.target.value)}
                    className="h-8"
                />
            )}
            
            {controlType === "select" && (
                <Select
                    value={controlItem as string}
                    onValueChange={handleChange}
                >
                    <SelectTrigger id={property} className="h-8">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem 
                                key={option} 
                                value={option}
                                className="flex items-center gap-2"
                            >
                                <span className="text-sm">
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </span>
                                {option === controlItem && <Check className="h-3.5 w-3.5 ml-auto" />}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
    );
};

export default ToolBarItem;
