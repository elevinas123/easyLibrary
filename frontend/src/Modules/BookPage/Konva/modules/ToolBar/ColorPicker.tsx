import { Button } from "../../../../../components/ui/button";

type ColorPickerProps = {
    selectedColor: string;
    onChange: (color: string) => void;
    colors: string[];
};

const ColorPicker = ({ selectedColor, onChange, colors }: ColorPickerProps) => {
    return (
        <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
                <Button
                    key={color}
                    variant="outline"
                    size="icon"
                    className={`w-6 h-6 rounded-full p-0 ${
                        selectedColor === color
                            ? "ring-2 ring-offset-2 ring-primary"
                            : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => onChange(color)}
                >
                    <span className="sr-only">Select color: {color}</span>
                </Button>
            ))}
        </div>
    );
};

export default ColorPicker;
