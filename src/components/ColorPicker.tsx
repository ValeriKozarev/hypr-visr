
import { COLOR_OPTIONS } from "../utils/colors";
import PickerDropdown from "./PickerDropdown";

type ColorName = keyof typeof COLOR_OPTIONS;

interface IColorPickerProps {
    value: ColorName | undefined;
    onChange: (colorName: ColorName) => void;
    defaultColor?: ColorName;
}

export default function ColorPicker({value, onChange, defaultColor = 'blue'}: IColorPickerProps) {
    const colorNames = Object.keys(COLOR_OPTIONS) as ColorName[];
    const selectedColor = value || defaultColor;
    const selectedHex = COLOR_OPTIONS[selectedColor].hex;

    return (
        <PickerDropdown<ColorName>
            value={value}
            options={colorNames}
            onChange={onChange}
            renderTrigger={(colorName) => {
                const hex = colorName ? COLOR_OPTIONS[colorName].hex : selectedHex;
                return (
                    <button className="flex h-10 w-10 items-center justify-center rounded border border-zinc-600 bg-zinc-800 transition-colors hover:bg-zinc-700 hover:border-amber-400/50">
                        <div
                            className="h-6 w-6 rounded-full border-2 border-zinc-600"
                            style={{ backgroundColor: hex }}
                        />
                    </button>
                );
            }}
            renderOption={(colorName) => {
                const hex = COLOR_OPTIONS[colorName].hex;
                return (
                    <div
                        className="h-8 w-8 rounded-full border-2 border-zinc-700"
                        style={{ backgroundColor: hex }}
                    />
                );
            }}
            align="right"
        />
    );
}