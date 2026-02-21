import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { ToDoList } from "../types"

interface IListItemProps {
    list: ToDoList
    isSelected: boolean;
    isEditing: boolean;

    onSelect: (id: string) => void;
    onStartEdit: () => void;
    onSaveEdit: (name: string) => void;
    onCancelEdit: () => void;
    onDelete: (id: string) => void;

    isDragging?: boolean;
    isOverlay?: boolean;
}

export default function ListItem({list, isSelected, isEditing, onSelect, onStartEdit, onSaveEdit, onCancelEdit, onDelete, isDragging, isOverlay}: IListItemProps) {
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: list.id,
        disabled: isOverlay, // Disable sorting for overlay
    });

    // Only apply transform if NOT using overlay
    const style = isOverlay ? {} : {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}    
            className={`group flex items-center justify-between rounded px-3 py-2 text-sm cursor-pointer transition-colors ${
                isSelected
                    ? 'bg-amber-400/10 text-amber-400 border-l-2 border-amber-400'
                    : 'text-neutral-400 hover:bg-zinc-800 hover:text-neutral-200'
            } ${
                isDragging ? 'opacity-40' : ''
            } ${
                isOverlay ? 'cursor-grabbing rotate-2 scale-105' : ''
            }`}
            onClick={() => {
                onSelect(list.id);
            }}
        >
            {isEditing ? (
                <input
                    autoFocus
                    defaultValue={list.name}
                    className="flex-1 bg-zinc-800 rounded px-2 py-1 text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSaveEdit(e.currentTarget.value.trim());
                        }
                        if (e.key === 'Escape') {
                            onCancelEdit();
                        }
                    }}
                    onBlur={(e) => {
                        onSaveEdit(e.target.value.trim());
                    }}
                />
            ) : (
                <>
                    {!isOverlay && (
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
                    <span className="flex-1 truncate">{list.name}</span>
                </>
            )}

            {!isEditing && !isOverlay && (
                <div className="flex shrink-0 items-center gap-1">
                    {/* Edit button */}
                    <button
                        className="shrink-0 rounded p-1 text-zinc-600 opacity-0 transition-all hover:bg-zinc-700 hover:text-amber-400 group-hover:opacity-100"
                        onClick={(e) => {
                            e.stopPropagation();
                            onStartEdit();
                        }}
                        aria-label="Rename list"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>

                    {/* Delete button */}
                    <button
                        className="shrink-0 rounded p-1 text-zinc-600 opacity-0 transition-all hover:bg-red-950/50 hover:text-red-400 group-hover:opacity-100"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(list.id);
                        }}
                        aria-label="Delete list"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
        </li>
    )
}