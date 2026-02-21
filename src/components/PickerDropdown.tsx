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
                <div className='absolute top-full left-0 mt-1'>
                    <div className='grid grid-cols-4 gap-2'>
                        {options.map((option) => (
                            <button onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleSelect(option)
                            }}>{renderOption(option)}</button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}