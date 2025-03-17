import { Check } from "lucide-react";
import { motion } from "framer-motion";

type ColorPickerProps = {
    selectedColor: string;
    onChange: (color: string) => void;
    colors: string[];
};

const ColorPicker = ({ selectedColor, onChange, colors }: ColorPickerProps) => {
    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-5 gap-2">
                {colors.map((color) => (
                    <motion.button
                        key={color}
                        className={`relative h-8 w-8 rounded-full transition-all duration-200 flex items-center justify-center`}
                        style={{ backgroundColor: color }}
                        onClick={() => onChange(color)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {selectedColor === color && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`flex items-center justify-center`}
                            >
                                <Check 
                                    className={`h-4 w-4 ${
                                        color === "#ffffff" || color === "#ffec99" || color === "#b2f2bb" || color === "#ffc9c9" || color === "#a5d8ff"
                                            ? "text-black"
                                            : "text-white"
                                    }`} 
                                />
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>
            <div>
                <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-8 cursor-pointer"
                />
            </div>
        </div>
    );
};

export default ColorPicker;
