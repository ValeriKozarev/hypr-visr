import { useState } from 'react';
import { generateId } from '../utils/generateId';
import { COLOR_OPTIONS } from '../utils/colors';

import type { Category } from '../types';
import EmojiPicker from './EmojiPicker';

type ColorName = keyof typeof COLOR_OPTIONS;

interface ICategoryManagerProps {
    categories: Category[];
    onAdd: (category: Category) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
}

export default function CategoryManager({categories, onAdd, onDelete, onClose}: ICategoryManagerProps) {
    const [label, setLabel] = useState('');
    const [icon, setIcon] = useState('');
    const [selectedColor, setSelectedColor] = useState('blue');

    const availableColors = Object.keys(COLOR_OPTIONS) as ColorName[];

    function handleAdd() {
        if (label.trim() && icon.trim()) {
            const config = COLOR_OPTIONS[selectedColor as ColorName];
            const newCategory: Category = {
                id: generateId(),
                label: label.trim(),
                icon: icon.trim(),
                color: config.color,
                bgColor: config.bgColor,
                borderColor: config.borderColor,
            };
            onAdd(newCategory);
            // Reset form
            setLabel('');
            setIcon('');
            setSelectedColor('blue');
        }
    }

    function handleDelete(id: string) {
        onDelete(id);
    }

    return (
        <div className="mt-2 rounded border border-amber-400/30 bg-zinc-900 p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-amber-400">
                    Manage Categories
                </div>
                <button
                    onClick={onClose}
                    className="text-xs text-neutral-400 hover:text-neutral-200"
                >
                    Done
                </button>
            </div>

            {categories.length > 0 && (
                <div className="space-y-2">
                    <div className="text-xs text-neutral-400">Categories:</div>
                    <div className="space-y-1">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                className="flex items-center justify-between rounded border border-zinc-700 bg-zinc-800 px-3 py-2"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">
                                        {cat.icon} {cat.label}
                                    </span>
                                    <span className={`text-xs ${cat.color}`}>
                                        {cat.color.replace('text-', '').replace('-400', '')}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        handleDelete(cat.id)
                                        }
                                    }
                                    className="rounded p-1 text-zinc-600 transition-all hover:bg-red-950/50 hover:text-red-400"
                                    aria-label={`Delete ${cat.label} category`}
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {categories.length > 0 && (
                <div className="border-t border-zinc-700" />
            )}

            <div className="space-y-3">
                <div className="text-xs text-neutral-400">Add New Category:</div>

                <input
                    type="text"
                    placeholder="Category name..."
                    maxLength={12}
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full rounded border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-400/50
focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                />

                <EmojiPicker
                    value={icon}
                    onChange={setIcon}
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
                                backgroundColor: COLOR_OPTIONS[color].hex,
                            }}
                            aria-label={`Select ${color} color`}
                        />
                    ))}
                    </div>
                </div>

                <button
                    onClick={handleAdd}
                    disabled={!label.trim() || !icon.trim()}
                    className="w-full rounded bg-amber-400 px-3 py-2 text-sm font-medium text-zinc-900 transition-all hover:bg-amber-300 disabled:opacity-50
disabled:cursor-not-allowed"
                >
                    Add Category
                </button>
            </div>
        </div>
    );
}