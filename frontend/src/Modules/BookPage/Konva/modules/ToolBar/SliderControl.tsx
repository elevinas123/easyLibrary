// SliderControl.tsx

import React from "react";

type SliderControlProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
};

const SliderControl = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: SliderControlProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm">{label}: {value}</label>
      <input
        type="range"
        className="w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
};

export default SliderControl;
