import { useState } from 'react';
import { generateId } from '../utils/generateId';
import type { Category } from '../types';

// Color configuration with pre-defined Tailwind classes
const colorConfigs = {
    blue: {
        name: 'blue',
        hex: '#3b82f6',
        color: 'text-blue-400',
        bgColor: 'bg-blue-950/30',
        borderColor: 'border-blue-500/50',
    },
    green: {
        name: 'green',
        hex: '#22c55e',
        color: 'text-green-400',
        bgColor: 'bg-green-950/30',
        borderColor: 'border-green-500/50',
    },
    amber: {
        name: 'amber',
        hex: '#f59e0b',
        color: 'text-amber-400',
        bgColor: 'bg-amber-950/30',
        borderColor: 'border-amber-500/50',
    },
    red: {
        name: 'red',
        hex: '#ef4444',
        color: 'text-red-400',
        bgColor: 'bg-red-950/30',
        borderColor: 'border-red-500/50',
    },
    purple: {
        name: 'purple',
        hex: '#a855f7',
        color: 'text-purple-400',
        bgColor: 'bg-purple-950/30',
        borderColor: 'border-purple-500/50',
    },
    pink: {
        name: 'pink',
        hex: '#ec4899',
        color: 'text-pink-400',
        bgColor: 'bg-pink-950/30',
        borderColor: 'border-pink-500/50',
    },
    indigo: {
        name: 'indigo',
        hex: '#6366f1',
        color: 'text-indigo-400',
        bgColor: 'bg-indigo-950/30',
        borderColor: 'border-indigo-500/50',
    },
    teal: {
        name: 'teal',
        hex: '#14b8a6',
        color: 'text-teal-400',
        bgColor: 'bg-teal-950/30',
        borderColor: 'border-teal-500/50',
    },
    orange: {
        name: 'orange',
        hex: '#f97316',
        color: 'text-orange-400',
        bgColor: 'bg-orange-950/30',
        borderColor: 'border-orange-500/50',
    },
    cyan: {
        name: 'cyan',
        hex: '#06b6d4',
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-950/30',
        borderColor: 'border-cyan-500/50',
    },
}

type ColorName = keyof typeof colorConfigs;

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

    const availableColors = Object.keys(colorConfigs) as ColorName[];

    function handleAdd() {
        if (label.trim() && icon.trim()) {
            const config = colorConfigs[selectedColor as ColorName];
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

                <input
                    type="text"
                    placeholder="Icon (emoji)..."
                    maxLength={2}
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full rounded border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-400/50
focus:outline-none focus:ring-2 focus:ring-amber-400/20"
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
                                backgroundColor: colorConfigs[color].hex,
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