// ToolBarItem.tsx

import ColorPicker from "./ColorPicker";
import SliderControl from "./SliderControl";

type ToolBarItemProps = {
  controlItem: string | number;
  updateItems: (property: { [key: string]: any }) => void;
  controlType: "color" | "number" | "text" | "select";
  options?: string[]; // For select type
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
    "#000000", "#ffffff", "#e03131", "#2f9e44", "#1971c2",
    "#f08c00", "#ffc9c9", "#b2f2bb", "#a5d8ff", "#ffec99",
  ];

  return (
    <div className="flex flex-col space-y-2">
      {controlType === "color" && (
        <>
          <label className="text-sm">{label}</label>
          <ColorPicker
            selectedColor={controlItem as string}
            onChange={handleChange}
            colors={predefinedColors}
          />
        </>
      )}
      {controlType === "number" && (
        <SliderControl
          label={label}
          min={0}
          max={10}
          step={0.1}
          value={controlItem as number}
          onChange={handleChange}
        />
      )}
      {controlType === "text" && (
        <>
          <label className="text-sm">{label}</label>
          <input
            type="text"
            value={controlItem as string}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full p-1 bg-zinc-800 text-white rounded"
          />
        </>
      )}
      {controlType === "select" && (
        <>
          <label className="text-sm">{label}</label>
          <select
            value={controlItem as string}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full p-1 bg-zinc-800 text-white rounded"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default ToolBarItem;
