import { useState } from 'react';
import TaskItem from "./TaskItem";
import TaskInput from "./TaskInput";
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

import type { Category, ToDoList as ToDoListType, Task } from '../types';

interface IToDoListProps {
    list: ToDoListType;
    onRemoveTask: (id: string) => void;
    onEditTask: (id: string, updates: Partial<Task>) => void;
    onAddTask: (title: string, description?: string, category?: string) => void;
    onToggleTask: (id: string) => void;
    onDragTask: (event: DragEndEvent) => void;
    categories: Category[];
    onAddCategory: (category: Category) => void;
    onDeleteCategory: (id: string) => void;
}

export default function ToDoList({ list, onRemoveTask, onEditTask, onAddTask, onToggleTask, onDragTask, categories, onAddCategory, onDeleteCategory }: IToDoListProps) {
    const activeTasks = list.tasks.filter(t => !t.isDone);
    const completedTasks = list.tasks.filter(t => t.isDone);
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
        onDragTask(event);
    }

    function handleDragCancel() {
        setActiveId(null);
    }

    const activeTask = activeId ? activeTasks.find(t => t.id === activeId) : null;

    return (
        <div className="space-y-6">
            <TaskInput onAdd={onAddTask} categories={categories} onAddCategory={onAddCategory} onDeleteCategory={onDeleteCategory}/>    

            {/* Active Tasks */}
            <section>
                <div className="mb-3 flex items-center gap-2">
                    <h2 className="text-xs font-medium uppercase tracking-wider text-amber-400/80">
                        Tasks
                    </h2>
                    {activeTasks.length > 0 && (
                        <span className="text-xs text-neutral-500">
                            ({activeTasks.length})
                        </span>
                    )}
                </div>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                >
                    <SortableContext items={activeTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        <ul className="space-y-2">
                            {activeTasks.map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onEdit={onEditTask}
                                    onToggle={onToggleTask}
                                    onDelete={onRemoveTask}
                                    categories={categories}
                                    onAddCategory={onAddCategory}
                                    onDeleteCategory={onDeleteCategory}
                                    isDragging={task.id === activeId}
                                />
                            ))}
                        </ul>
                    </SortableContext>

                    <DragOverlay>
                        {activeTask ? (
                            <div className="cursor-grabbing">
                                <TaskItem
                                    task={activeTask}
                                    onEdit={() => {}}
                                    onToggle={() => {}}
                                    onDelete={() => {}}
                                    categories={categories}
                                    onAddCategory={() => {}}
                                    onDeleteCategory={() => {}}
                                    isDragging={false}
                                    isOverlay
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
                {activeTasks.length === 0 && (
                    <div className="rounded border border-zinc-700 bg-zinc-800/50">
                        <p className="py-8 text-center text-sm text-neutral-500">
                            No tasks yet. Add one above to get started.
                        </p>
                    </div>
                )}
            </section>

            {/* Completed Tasks aka Task History */}
            {completedTasks.length > 0 && (
                <section>
                    <div className="mb-3 flex items-center gap-2">
                        <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                            Completed
                        </h2>
                    </div>
                    <ul className="space-y-2">
                        {completedTasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onEdit={onEditTask}
                                onToggle={onToggleTask}
                                onDelete={onRemoveTask}
                                categories={categories}
                                onAddCategory={onAddCategory}
                                onDeleteCategory={onDeleteCategory}
                            />
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
