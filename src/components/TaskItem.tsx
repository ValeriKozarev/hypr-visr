import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, CATEGORIES } from '../types';

// data down, actions up: a task needs to be able to propagate actions back up to the list for the state to change correctly
interface ITaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: ITaskItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);

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
            className={`group rounded-lg shadow-sm ring-1 transition-shadow hover:shadow-md ${
                categoryConfig
                    ? `${categoryConfig.bgColor} ${categoryConfig.borderColor} ${categoryConfig.color}`
                    : 'bg-white ring-neutral-100 hover:ring-neutral-200 text-neutral-700'
            }`}
        >
            <div className="flex items-center gap-3 p-3">
                {/* Handle for drag 'n drop */}
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

                {/* Checkbox for toggling task completion */}
                <input
                    type="checkbox"
                    checked={task.isDone}
                    onChange={() => onToggle(task.id)}
                    className="h-4 w-4 shrink-0 cursor-pointer rounded border-neutral-300 text-neutral-800 focus:ring-2 focus:ring-neutral-200 focus:ring-offset-0"
                />

                <div
                    className="min-w-0 flex-1 cursor-pointer"
                    onClick={() => hasDescription && setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-2">
                        <span className={`text-sm ${task.isDone ? "text-neutral-400 line-through" : ""}`}>
                            {categoryConfig?.icon} {task.title}
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

                    {/* Description - clickable to expand */}
                    {hasDescription && (
                        <p className={`mt-1 text-xs text-neutral-500 ${
                            !isExpanded && isLongDescription ? 'truncate' : ''
                        }`}>
                            {task.description}
                        </p>
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
