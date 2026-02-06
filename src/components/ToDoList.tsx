import TaskItem from "./TaskItem";
import TaskInput from "./TaskInput";
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import type { CategoryEnum, ToDoList as ToDoListType, Task } from '../types';

interface IToDoListProps {
    list: ToDoListType;
    onRemoveTask: (id: number) => void;
    onEditTask: (id: number, updates: Partial<Task>) => void;
    onAddTask: (title: string, description?: string, category?: CategoryEnum) => void;
    onToggleTask: (id: number) => void;
    onDragTask: (event: DragEndEvent) => void;
}

export default function ToDoList({ list, onRemoveTask, onEditTask, onAddTask, onToggleTask, onDragTask }: IToDoListProps) {    
    const activeTasks = list.tasks.filter(t => !t.isDone);
    const completedTasks = list.tasks.filter(t => t.isDone);

    return (
        <div className="space-y-6">
            <TaskInput onAdd={onAddTask} />    

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
                <DndContext collisionDetection={closestCenter} onDragEnd={onDragTask}>
                    <SortableContext items={activeTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        <ul className="space-y-2">
                            {activeTasks.map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onEdit={onEditTask}
                                    onToggle={onToggleTask}
                                    onDelete={onRemoveTask}
                                />
                            ))}
                        </ul>
                    </SortableContext>
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
                            />
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
