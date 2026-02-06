import ListInput from "./ListInput";

import type { ToDoList } from "../types";

interface IListManagerProps {
    lists: ToDoList[];
    selectedListId: number | null;
    onListSelect: (id: number) => void;
    onAddList: (name: string) => void;
    onDeleteList: (id: number) => void;
    onRenameList: (id: number, name: string) => void;
}

export default function ListManager({lists, selectedListId, onListSelect, onAddList, onDeleteList}: IListManagerProps) {
    return (
        <nav className="flex h-full flex-col">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-amber-400/80">
                Lists
            </h2>

            <ListInput onAddList={onAddList}/>

            <ul className="mt-4 flex-1 space-y-1">
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
                        <span className="truncate">{list.name}</span>
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
                    </li>
                ))}
            </ul>

            {lists.length === 0 && (
                <p className="mt-4 text-center text-xs text-neutral-600">
                    No lists yet
                </p>
            )}
        </nav>
    )
}
