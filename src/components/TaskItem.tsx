import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Task, Category, CATEGORIES } from '../types';

interface ITaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onUpdateCategory: (id: number, category: Category | undefined) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onUpdateCategory }: ITaskItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const categoryConfig = task.category ? CATEGORIES.find(c => c.id === task.category) : null;
    const hasDescription = task.description && task.description.trim().length > 0;
    const isLongDescription = hasDescription && task.description!.length > 80;

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={`group rounded-lg bg-white shadow-sm ring-1 transition-shadow hover:shadow-md ${
                categoryConfig
                    ? `ring-1 ${categoryConfig.borderColor}`
                    : 'ring-neutral-100 hover:ring-neutral-200'
            }`}
        >
            {/* Main row */}
            <div className="flex items-center gap-3 p-3">
                {/* Drag handle */}
                {!task.isDone && (
                    <span
                        {...listeners}
                        className="cursor-grab touch-none text-neutral-300 opacity-0 transition-opacity hover:text-neutral-400 group-hover:opacity-100"
                        aria-label="Drag to reorder"
                    >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                            <circle cx="4" cy="3" r="1.5"/>
                            <circle cx="4" cy="8" r="1.5"/>
                            <circle cx="4" cy="13" r="1.5"/>
                            <circle cx="10" cy="3" r="1.5"/>
                            <circle cx="10" cy="8" r="1.5"/>
                            <circle cx="10" cy="13" r="1.5"/>
                        </svg>
                    </span>
                )}

                {/* Checkbox */}
                <input
                    type="checkbox"
                    checked={task.isDone}
                    onChange={() => onToggle(task.id)}
                    className="h-4 w-4 shrink-0 cursor-pointer rounded border-neutral-300 text-neutral-800 focus:ring-2 focus:ring-neutral-200 focus:ring-offset-0"
                />

                {/* Content area - clickable to expand */}
                <div
                    className="min-w-0 flex-1 cursor-pointer"
                    onClick={() => hasDescription && setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-2">
                        <span className={`text-sm ${task.isDone ? "text-neutral-400 line-through" : "text-neutral-700"}`}>
                            {task.title}
                        </span>
                        {hasDescription && (
                            <svg
                                className={`h-3 w-3 shrink-0 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        )}
                    </div>

                    {/* Description preview or full */}
                    {hasDescription && (
                        <p className={`mt-1 text-xs text-neutral-500 ${
                            !isExpanded && isLongDescription ? 'truncate' : ''
                        }`}>
                            {task.description}
                        </p>
                    )}
                </div>

                {/* Category badge */}
                <div className="relative">
                    <button
                        onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors ${
                            categoryConfig
                                ? `${categoryConfig.bgColor} ${categoryConfig.color} ${categoryConfig.borderColor}`
                                : 'border-neutral-200 bg-neutral-50 text-neutral-400 hover:bg-neutral-100'
                        }`}
                    >
                        {categoryConfig ? categoryConfig.label : 'No category'}
                    </button>

                    {/* Category picker dropdown */}
                    {showCategoryPicker && (
                        <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-lg bg-white p-1 shadow-lg ring-1 ring-neutral-200">
                            <button
                                onClick={() => { onUpdateCategory(task.id, undefined); setShowCategoryPicker(false); }}
                                className={`w-full rounded px-2 py-1.5 text-left text-xs transition-colors ${
                                    !task.category ? 'bg-neutral-100 font-medium' : 'hover:bg-neutral-50'
                                }`}
                            >
                                None
                            </button>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => { onUpdateCategory(task.id, cat.id); setShowCategoryPicker(false); }}
                                    className={`w-full rounded px-2 py-1.5 text-left text-xs transition-colors ${
                                        task.category === cat.id
                                            ? `${cat.bgColor} ${cat.color} font-medium`
                                            : 'hover:bg-neutral-50'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Delete button */}
                <button
                    onClick={() => onDelete(task.id)}
                    className="shrink-0 rounded p-1 text-neutral-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-200 group-hover:opacity-100"
                    aria-label="Delete task"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </li>
    );
}
