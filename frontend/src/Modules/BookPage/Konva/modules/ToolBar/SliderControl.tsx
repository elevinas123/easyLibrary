import { Slider } from "../../../../../components/ui/slider";

type SliderControlProps = {
    id: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number) => void;
};

const SliderControl = ({
    id,
    min,
    max,
    step,
    value,
    onChange,
}: SliderControlProps) => {
    return (
        <Slider
            id={id}
            min={min}
            max={max}
            step={step}
            value={[value]}
            onValueChange={(values) => onChange(values[0])}
        />
    );
};

export default SliderControl;
