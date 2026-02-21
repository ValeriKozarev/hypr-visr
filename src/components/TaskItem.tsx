import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, Category } from '../types';
import TaskInput from './TaskInput';

interface ITaskItemProps {
    task: Task;
    onEdit: (id: string, updates: Partial<Task>) => void;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    categories: Category[];
    onAddCategory: (category: Category) => void
    onDeleteCategory: (id: string) => void
    isDragging?: boolean;
    isOverlay?: boolean;
}

export default function TaskItem({ task, onEdit, onToggle, onDelete, categories, onAddCategory, onDeleteCategory, isDragging, isOverlay }: ITaskItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: task.id,
        disabled: isOverlay, // Disable sorting for overlay
    });

    // Only apply transform if NOT using overlay
    const style = isOverlay ? {} : {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const categoryConfig = task.category ? categories.find(c => c.id === task.category) : null;
    const hasDescription = task.description && task.description.trim().length > 0;
    const isLongDescription = hasDescription && task.description!.length > 80;

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={`group rounded border shadow-lg hover:shadow-xl ${
                categoryConfig
                    ? `${categoryConfig.bgColor} ${categoryConfig.borderColor} ${categoryConfig.color}`
                    : 'border-zinc-700 bg-zinc-800 text-neutral-100'
            } ${task.isDone ? 'opacity-60' : ''} ${
                isDragging ? 'opacity-40' : ''
            } ${
                isOverlay ? 'cursor-grabbing rotate-2 scale-105' : ''
            }`}
        >
            {isEditing ? (
                <TaskInput
                    initialTask={task}
                    onSave={(updates) => {
                        onEdit(task.id, updates);
                        setIsEditing(false);
                    }}
                    onCancel={() => setIsEditing(false)}
                    categories={categories}
                    onAddCategory={onAddCategory}
                    onDeleteCategory={onDeleteCategory}
                />
            ) : (
                <div className="flex items-center gap-3 p-3">
                    {/* Handle for drag 'n drop */}
                    {!task.isDone && (
                        <span
                            {...listeners}
                            className="cursor-grab touch-none text-zinc-600 opacity-0 transition-opacity hover:text-zinc-400 group-hover:opacity-100"
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
                        className="h-4 w-4 shrink-0 cursor-pointer rounded border-zinc-500 bg-zinc-900 text-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:ring-offset-0"
                    />

                    <div
                        className="min-w-0 flex-1 cursor-pointer"
                        onClick={() => hasDescription && setIsExpanded(!isExpanded)}
                    >
                        <div className="flex items-center gap-2">
                            <span className={`text-sm ${task.isDone ? "text-neutral-500 line-through" : ""}`}>
                                {categoryConfig?.icon} {task.title}
                            </span>
                            {hasDescription && (
                                <svg
                                    className={`h-3 w-3 shrink-0 text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
                            <p className={`mt-1 text-xs text-neutral-400 ${
                                !isExpanded && isLongDescription ? 'truncate' : ''
                            }`}>
                                {task.description}
                            </p>
                        )}
                    </div>

                    {/* buttons */}
                    <button
                        onClick={() => setIsEditing(true)}
                        className="shrink-0 rounded p-1 text-zinc-600 opacity-0 transition-all hover:bg-zinc-700 hover:text-amber-400 group-hover:opacity-100"                    
                        aria-label="Edit task"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>

                    <button
                        onClick={() => onDelete(task.id)}
                        className="shrink-0 rounded p-1 text-zinc-600 opacity-0 transition-all hover:bg-red-950/50 hover:text-red-400 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400/30 group-hover:opacity-100"
                        aria-label="Delete task"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
        </li>
    );
}
