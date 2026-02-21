import { useState } from "react";
import ListInput from "./ListInput";

import type { ToDoList } from "../types";

interface IListManagerProps {
    lists: ToDoList[];
    selectedListId: string | null;
    onListSelect: (id: string) => void;
    onAddList: (name: string) => void;
    onDeleteList: (id: string) => void;
    onRenameList: (id: string, name: string) => void;
}

export default function ListManager({lists, selectedListId, onListSelect, onAddList, onDeleteList, onRenameList}: IListManagerProps) {
    const [editingListId, setEditingListId] = useState<string | null>(null);

    return (
        <section>
            <ListInput onAddList={onAddList} />
            <ul className="mt-4 space-y-2">
                {lists.map(list => (
                    <li
                        key={list.id}
                        className={`group flex items-center justify-between rounded px-3 py-2 text-sm cursor-pointer transition-colors ${
                            list.id === selectedListId
                                ? 'bg-amber-400/10 text-amber-400 border-l-2 border-amber-400'
                                : 'text-neutral-400 hover:bg-zinc-800 hover:text-neutral-200'
                        }`}
                        onClick={() => onListSelect(list.id)}
                    >
                        {editingListId === list.id ? (
                            <input
                                autoFocus
                                defaultValue={list.name}
                                className="flex-1 bg-zinc-800 rounded px-2 py-1 text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onRenameList(list.id, e.currentTarget.value.trim());
                                        setEditingListId(null);
                                    }
                                    if (e.key === 'Escape') {
                                        setEditingListId(null);
                                    }
                                }}
                                onBlur={(e) => {
                                    onRenameList(list.id, e.target.value.trim());
                                    setEditingListId(null);
                                }}
                            />
                        ) : (
                            <span className="truncate">{list.name}</span>
                        )}

                        {editingListId !== list.id && (
                            <div className="flex shrink-0 items-center gap-1">
                                {/* Edit button */}
                                <button
                                    className="shrink-0 rounded p-1 text-zinc-600 opacity-0 transition-all hover:bg-zinc-700 hover:text-amber-400 group-hover:opacity-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingListId(list.id);
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
                                        onDeleteList(list.id);
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
                ))}
            </ul>
        </section>
    )
}