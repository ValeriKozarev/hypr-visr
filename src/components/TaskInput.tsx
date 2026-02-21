import { useState } from 'react';
import CategoryManager from './CategoryManager';
import type { CategoryEnum, Task, Category } from '../types';

interface ITaskInputProps {
    // For add mode
    onAdd?: (title: string, description?: string, category?: CategoryEnum) => void;

    // For edit mode
    initialTask?: Task;
    onSave?: (updates: Partial<Task>) => void;
    onCancel?: () => void;

    categories: Category[];
    onAddCategory: (category: Category) => void;
    onDeleteCategory: (id: string) => void;
}

export default function TaskInput({ onAdd, initialTask, onSave, onCancel, categories, onAddCategory, onDeleteCategory }: ITaskInputProps) {
    const isEditMode = !!initialTask

    const [title, setTitle] = useState(initialTask ? initialTask.title : '');
    const [description, setDescription] = useState(initialTask ? initialTask.description || '' : '');
    const [category, setCategory] = useState<CategoryEnum | undefined>(initialTask?.category);
    const [showDetails, setShowDetails] = useState(isEditMode ? true : false);
    const [showCategoryInput, setShowCategoryInput] = useState(false);

    function addTask() {
        if (title.trim()) {
            onAdd && onAdd(title, description || undefined, category);
            setTitle('');
            setDescription('');
            setCategory(undefined);
            setShowDetails(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isEditMode) {
                onSave && onSave({ title, description, category });
            } else {
                addTask();
            }
        }
    }

    return (
        <div className={`rounded p-4 shadow-lg ${
            isEditMode
                ? 'bg-zinc-800 ring-2 ring-amber-400/50'
                : 'bg-zinc-800 ring-1 ring-zinc-700'
        }`}>
            {isEditMode && (
                <div className="mb-3 text-xs font-medium uppercase tracking-wider text-amber-400/80">
                    Editing Task
                </div>
            )}
            <div className="flex gap-2">
                <input
                    className="flex-1 rounded border border-zinc-600 bg-zinc-900 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 transition-colors focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                    type="text"
                    placeholder="Add a new task..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowDetails(true)}
                />
                <button
                    className="rounded bg-amber-400 px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-[0_0_10px_rgba(251,191,36,0.3)] transition-all hover:bg-amber-300 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] focus:outline-none focus:ring-2 focus:ring-amber-400/50 disabled:opacity-50 disabled:shadow-none"
                    onClick={isEditMode ? () => onSave && onSave({ title, description, category }) : addTask}
                    disabled={!title.trim()}
                >
                    {isEditMode ? 'Update' : 'Add'}
                </button>
            </div>

            {showDetails && (
                <div className="mt-3 space-y-3">
                    <div className="relative">
                        <textarea
                            className="w-full resize-none rounded border border-zinc-600 bg-zinc-900 px-4 py-2.5 pb-6 text-sm text-neutral-100 placeholder-neutral-500 transition-colors focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                            placeholder="Add a description (optional)..."
                            rows={2}
                            maxLength={250}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <span className="absolute bottom-2.5 right-3 text-xs text-neutral-500">
                            {description.length}/250
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-neutral-400">Category:</span>
                            <button
                                onClick={() => setCategory(undefined)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                    category === undefined
                                        ? 'bg-zinc-600 text-neutral-200 ring-1 ring-zinc-500'
                                        : 'bg-zinc-700 text-neutral-400 hover:bg-zinc-600'
                                }`}
                            >
                                None
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategory(cat.id)}
                                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                                        cat.bgColor
                                    } ${
                                        cat.borderColor
                                    } ${
                                        cat.color
                                    } ${
                                        category === cat.id
                                            ? 'ring-1 ring-amber-400 scale-105'
                                            : 'hover:scale-105 opacity-80 hover:opacity-100'
                                    }`}
                                >
                                    {cat.icon} {cat.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                if (onCancel) {
                                    onCancel();
                                } else {
                                    setShowDetails(false);
                                    setTitle('');
                                    setDescription('');
                                    setCategory(undefined);
                                }
                            }}
                            className="rounded px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:bg-red-950/50 hover:text-red-400 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400/30 group-hover:opacity-100"
                        >
                            Cancel
                        </button>
                    </div>
                    
                    {!showCategoryInput && (
                        <button
                            onClick={() => setShowCategoryInput(true)}
                            className="rounded-full border border-dashed border-zinc-600 px-3 py-1 text-xs font-medium text-neutral-500 transition-colors hover:border-amber-400/50
                    hover:text-amber-400"
                        >
                            Manage Categories
                        </button>
                    )}

                    {showCategoryInput && (
                        <CategoryManager
                            categories={categories}
                            onAdd={(newCategory) => {
                                onAddCategory(newCategory);
                                setCategory(newCategory.id);  // Auto-select the new category
                            }}
                            onDelete={onDeleteCategory}
                            onClose={() => setShowCategoryInput(false)}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
