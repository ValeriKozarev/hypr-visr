import { useState, useRef, ReactNode } from "react";
import {  } from "react";

interface IPickerDropdownProps<T> {
    options: T[];
    value: T | undefined;
    onChange: (value: T) => void;
    renderTrigger: (value: T | undefined, isOpen: boolean) => ReactNode;
    renderOption: (option: T) => ReactNode;
}

export default function PickerDropdown<T>({options, value, onChange, renderTrigger, renderOption}: IPickerDropdownProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    function handleSelect(option: T) {
        onChange(option);
        setIsOpen(false);
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)}>
                {renderTrigger(value, isOpen)}
            </button>

            {isOpen && (
                <>
                    {/* Arrow pointer - outer border */}
                    <div className="absolute left-3 top-full z-20 h-0 w-0 border-x-8 border-b-8 border-x-transparent border-b-zinc-600" />
                    {/* Arrow pointer - inner fill */}
                    <div className="absolute left-[13px] top-[41px] z-20 h-0 w-0 border-x-[7px] border-b-[7px] border-x-transparent border-b-zinc-800" />

                    {/* Dropdown content */}
                    <div className="absolute left-0 top-full z-10 mt-2 w-48 rounded border border-zinc-600 bg-zinc-800 p-2 shadow-lg">
                        <div className="grid grid-cols-4 gap-1">
                            {options.map((option, index) => {
                                const isSelected = option === value;
                                return (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            handleSelect(option)
                                        }}
                                        className={`flex h-10 w-10 items-center justify-center rounded text-xl transition-colors ${
                                            isSelected
                                                ? 'bg-amber-400/20 ring-1 ring-amber-400'
                                                : 'hover:bg-amber-400/10 hover:ring-1 hover:ring-amber-400/50'
                                        }`}
                                    >
                                        {renderOption(option)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}