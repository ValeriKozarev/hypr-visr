import { useState } from "react";
import TaskItem from "./TaskItem";
import TaskInput from "./TaskInput";
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Task, CategoryEnum } from '../types';

export default function ToDoList() {
    const [taskList, setTaskList] = useState<Task[]>([]);

    function removeTaskFromList(id: number) {
        setTaskList(taskList.filter((task) => task.id !== id));
    }

    function addTaskToList(title: string, description?: string, category?: CategoryEnum) {
        const newTask: Task = {
            id: Date.now(),
            title,
            isDone: false,
            description,
            category
        };
        setTaskList([newTask, ...taskList]);
    }

    function toggleTask(id: number) {
        const task = taskList.find(t => t.id === id);
        if (!task) return;

        const isNowDone = !task.isDone;
        const updatedTask = { ...task, isDone: isNowDone };
        const otherTasks = taskList.filter(t => t.id !== id);

        const active = otherTasks.filter(t => !t.isDone);
        const completed = otherTasks.filter(t => t.isDone);

        if (isNowDone) {
            setTaskList([...active, updatedTask, ...completed]);
        } else {
            setTaskList([updatedTask, ...active, ...completed]);
        }
    }

    const activeTasks = taskList.filter(t => !t.isDone);
    const completedTasks = taskList.filter(t => t.isDone);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = activeTasks.findIndex(t => t.id === active.id);
        const newIndex = activeTasks.findIndex(t => t.id === over.id);

        const reorderedActive = arrayMove(activeTasks, oldIndex, newIndex);
        setTaskList([...reorderedActive, ...completedTasks]);
    }

    return (
        <div className="space-y-6">
            <TaskInput onAdd={addTaskToList} />    

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
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={activeTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        <ul className="space-y-2">
                            {activeTasks.map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={toggleTask}
                                    onDelete={removeTaskFromList}
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
                                onToggle={toggleTask}
                                onDelete={removeTaskFromList}
                            />
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
