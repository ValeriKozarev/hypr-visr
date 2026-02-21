import { useState } from 'react';

import type { Category } from '../types';

interface ICategoryInputProps {
    onAdd: (category: Category) => void;
    onCancel: () => void
}

export default function CategoryInput({onAdd, onCancel}: ICategoryInputProps) {
    const [label, setLabel] = useState('');
    const [icon, setIcon] = useState('');
    const [selectedColor, setSelectedColor] = useState('blue');

    const availableColors = [
        'blue', 'green', 'amber', 'red', 'purple',
        'pink', 'indigo', 'teal', 'orange', 'cyan'
    ];

    function handleAddCategory() {
        if (label.trim() && icon.trim()) {
            const newCategory: Category = {
                id: label.toLowerCase().replace(/\s+/g, '-'), // Generate ID from name
                label: label.trim(),
                icon: icon.trim(),
                color: `text-${selectedColor}-400`,
                bgColor: `bg-${selectedColor}-950/30`,
                borderColor: `border-${selectedColor}-500/50`,
            };
            onAdd(newCategory);

            // and then dont forget to reset the form
            setLabel('');
            setIcon('');
            setSelectedColor('blue');
        }
    }

    return (
        <div className="mt-2 rounded border border-amber-400/30 bg-zinc-900 p-3 space-y-3">
            <div className="text-xs font-medium text-amber-400">
                Create New Category
            </div>

            <input
                type="text"
                placeholder="Category name..."
                maxLength={12}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full rounded border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
            />

            <input
                type="text"
                placeholder="Icon (emoji)..."
                maxLength={2}
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full rounded border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
            />

            <div>
                <div className="mb-2 text-xs text-neutral-400">Color:</div>
                <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`h-8 w-8 rounded-full border-2 transition-all ${
                                selectedColor === color
                                    ? 'ring-2 ring-amber-400 scale-110'
                                    : 'border-zinc-600 hover:scale-105'
                            }`}
                            style={{
                                backgroundColor: `var(--color-${color})`,
                            }}
                            aria-label={`Select ${color} color`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handleAddCategory}
                    disabled={!label.trim() || !icon.trim()}
                    className="flex-1 rounded bg-amber-400 px-3 py-2 text-sm font-medium text-zinc-900 transition-all hover:bg-amber-300 disabled:opacity-50
disabled:cursor-not-allowed"
                >
                    Add Category
                </button>

                <button
                    onClick={onCancel}
                    className="rounded px-3 py-2 text-sm text-neutral-400 transition-colors hover:bg-red-950/50 hover:text-red-400"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}