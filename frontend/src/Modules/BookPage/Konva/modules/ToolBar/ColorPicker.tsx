// ColorPicker.tsx

type ColorPickerProps = {
    selectedColor: string;
    onChange: (color: string) => void;
    colors: string[];
};

const ColorPicker = ({ selectedColor, onChange, colors }: ColorPickerProps) => {
    return (
        <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
                <button
                    key={color}
                    className={`w-6 h-6 rounded-full border-2 ${
                        selectedColor === color
                            ? "border-blue-500"
                            : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => onChange(color)}
                />
            ))}
        </div>
    );
};

export default ColorPicker;
