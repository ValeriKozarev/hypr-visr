import { useState } from 'react';
import { CATEGORIES, Category } from '../types';

interface ITaskInputProps {
    onAdd: (title: string, description?: string, category?: Category) => void;
}

export default function TaskInput({ onAdd }: ITaskInputProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<Category | undefined>(undefined);
    const [showDetails, setShowDetails] = useState(false);

    function addTask() {
        if (title.trim()) {
            onAdd(title, description || undefined, category);
            setTitle('');
            setDescription('');
            setCategory(undefined);
            setShowDetails(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addTask();
        }
    }

    return (
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-neutral-100">
            {/* Title input row */}
            <div className="flex gap-2">
                <input
                    className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 transition-colors focus:border-neutral-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200"
                    type="text"
                    placeholder="Add a new task..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowDetails(true)}
                />
                <button
                    className="rounded-lg bg-neutral-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:opacity-50"
                    onClick={addTask}
                    disabled={!title.trim()}
                >
                    Add
                </button>
            </div>

            {/* Expandable details section */}
            {showDetails && (
                <div className="mt-3 space-y-3">
                    {/* Description */}
                    <div>
                        <textarea
                            className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 transition-colors focus:border-neutral-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200"
                            placeholder="Add a description (optional)..."
                            rows={2}
                            maxLength={250}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="mt-1 text-right text-xs text-neutral-400">
                            {description.length}/250
                        </div>
                    </div>

                    {/* Category selection */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-neutral-500">Category:</span>
                        <button
                            onClick={() => setCategory(undefined)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                category === undefined
                                    ? 'bg-neutral-200 text-neutral-700'
                                    : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                            }`}
                        >
                            None
                        </button>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                                    category === cat.id
                                        ? `${cat.bgColor} ${cat.color} ${cat.borderColor}`
                                        : 'border-transparent bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
