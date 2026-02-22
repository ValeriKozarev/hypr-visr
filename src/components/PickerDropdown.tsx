import { useState, useRef, useEffect, ReactNode } from "react";

interface IPickerDropdownProps<T> {
    options: T[];
    value: T | undefined;
    onChange: (value: T) => void;
    renderTrigger: (value: T | undefined, isOpen: boolean) => ReactNode;
    renderOption: (option: T) => ReactNode;
    align?: 'left' | 'right';
}

export default function PickerDropdown<T>({options, value, onChange, renderTrigger, renderOption, align}: IPickerDropdownProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [shouldRenderAbove, setShouldRenderAbove] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    function handleSelect(option: T) {
        onChange(option);
        setIsOpen(false);
    }

    // Calculate if dropdown should render above or below
    useEffect(() => {
        if (!isOpen || !dropdownRef.current) return;

        const triggerRect = dropdownRef.current.getBoundingClientRect();
        const dropdownHeight = 250
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        // If not enough space below but more space above, render above
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
            setShouldRenderAbove(true);
        } else {
            setShouldRenderAbove(false);
        }
    }, [isOpen]);

    // Handle click outside and Escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>
                {renderTrigger(value, isOpen)}
            </div>

            {isOpen && (
                <>
                    {/* Arrow outer border */}
                    <div className={`absolute ${
                        align === 'right' ? 'right-3' : 'left-3'
                    } ${
                        shouldRenderAbove ? 'bottom-full' : 'top-full'
                    } z-20 h-0 w-0 border-x-8 ${
                        shouldRenderAbove
                            ? 'border-t-8 border-x-transparent border-t-zinc-600 mb-[-2px]'
                            : 'border-b-8 border-x-transparent border-b-zinc-600'
                    }`} />

                    {/* Arrow inner fill */}
                    <div className={`absolute ${
                        align === 'right' ? 'right-[13px]' : 'left-[13px]'
                    } ${
                        shouldRenderAbove ? 'bottom-[calc(100%-1px)]' : 'top-[41px]'
                    } z-20 h-0 w-0 border-x-[7px] ${
                        shouldRenderAbove
                            ? 'border-t-[7px] border-x-transparent border-t-zinc-800'
                            : 'border-b-[7px] border-x-transparent border-b-zinc-800'
                    }`} />

                    {/* Dropdown content */}
                    <div className={`absolute ${
                        align === 'right' ? 'right-0' : 'left-0'
                    } ${
                        shouldRenderAbove ? 'bottom-full mb-2' : 'top-full mt-2'
                    } z-10 w-48 rounded border border-zinc-600 bg-zinc-800 p-2 shadow-lg max-h-80 overflow-y-auto`}>
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