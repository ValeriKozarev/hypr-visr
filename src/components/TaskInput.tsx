import { useState } from 'react';
import { CATEGORIES, CategoryEnum } from '../types';

interface ITaskInputProps {
    onAdd: (title: string, description?: string, category?: CategoryEnum) => void;
}

export default function TaskInput({ onAdd }: ITaskInputProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<CategoryEnum | undefined>(undefined);
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
        <div className="rounded bg-zinc-800 p-4 shadow-lg ring-1 ring-zinc-700">
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
                    onClick={addTask}
                    disabled={!title.trim()}
                >
                    Add
                </button>
            </div>

            {showDetails && (
                <div className="mt-3 space-y-3">
                    <div className="mb-0">
                        <textarea
                            className="w-full resize-none rounded border border-zinc-600 bg-zinc-900 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 transition-colors focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                            placeholder="Add a description (optional)..."
                            rows={2}
                            maxLength={250}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="mt-1 text-right text-xs text-neutral-500">
                            {description.length}/250
                        </div>
                    </div>

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
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                                    category === cat.id
                                        ? `bg-zinc-800 ${cat.color} ${cat.borderColor}`
                                        : 'border-zinc-600 bg-zinc-700 text-neutral-400 hover:bg-zinc-600'
                                }`}
                            >
                                {cat.icon} {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
