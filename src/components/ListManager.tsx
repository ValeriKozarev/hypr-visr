import { useState } from "react";
import ListInput from "./ListInput";
import ListItem from "./ListItem";
import {
    DndContext,
    closestCenter,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import type { ToDoList } from "../types";

interface IListManagerProps {
    lists: ToDoList[];
    selectedListId: string | null;
    onListSelect: (id: string) => void;
    onDragList: (event: DragEndEvent) => void;
    onAddList: (name: string, icon?: string) => void;
    onDeleteList: (id: string) => void;
    onRenameList: (id: string, name: string, icon?: string) => void;
}

export default function ListManager({lists, selectedListId, onListSelect, onDragList, onAddList, onDeleteList, onRenameList}: IListManagerProps) {
    const [editingListId, setEditingListId] = useState<string | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

    // Optimized sensor - requires 5px movement before drag starts (prevents accidental drags)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );


    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveId(null);
        onDragList(event);
    }

    function handleDragCancel() {
        setActiveId(null);
    }

    const activeList = activeId ? lists.find(l => l.id === activeId) : null;

    return (
        <section>
            <ListInput onAddList={onAddList} />
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <SortableContext items={lists.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    <ul className="mt-4 space-y-2">
                        {lists.map(list => (
                            <ListItem
                                key={list.id}
                                list={list}
                                isSelected={selectedListId === list.id}
                                isEditing={editingListId === list.id}
                                onSelect={onListSelect}
                                onStartEdit={() => setEditingListId(list.id)}
                                onSaveEdit={(name: string, icon?: string) => {
                                    onRenameList(list.id, name, icon);
                                    setEditingListId(null);
                                }}
                                onCancelEdit={() => setEditingListId(null)}
                                onDelete={onDeleteList}
                                isDragging={list.id === activeId}
                            />
                        ))}
                    </ul>
                </SortableContext>
                <DragOverlay>
                    {activeList ? (
                        <ListItem
                            list={activeList}
                            isSelected={selectedListId === activeList.id}
                            isEditing={false}
                            onSelect={onListSelect}
                            onStartEdit={() => {}} // no-op since we are in an overlay
                            onSaveEdit={() => {}}
                            onCancelEdit={() => {}}
                            onDelete={onDeleteList}
                            isDragging={false}
                            isOverlay
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </section>
    )
}