import { useState } from "react";
import TaskItem from "./TaskItem";
import TaskInput from "./TaskInput";

import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

import type { Task } from '../types';

export default function ToDoList() {
    const [taskList, setTaskList] = useState<Task[]>([]);

    function removeTaskFromList(id: number) {
        const newTaskList = taskList.filter((task) => task.id !== id);
        setTaskList(newTaskList);
    }

    function addTaskToList(taskTitle: string) {
        const newTask: Task = {
            id: Date.now(), // TODO: improve this later
            title: taskTitle,
            isDone: false
        }
        const newTaskList = [newTask, ...taskList, ];
        setTaskList(newTaskList);
    }

    function toggleTask(id: number) {
        setTaskList(taskList.map(task => 
            task.id === id
                ? {...task, isDone: !task.isDone} 
                : task
        ))
    }

    const activeTasks = taskList.filter(t => !t.isDone);
    const completedTasks = taskList.filter(t => t.isDone);

    function handleDragEnd(event: any) {
        const { active, over } = event;

        // If dropped outside or in same position, do nothing
        if (!over || active.id === over.id) {
            return;
        }

        // Find old and new positions within active tasks
        const oldIndex = activeTasks.findIndex(t => t.id === active.id);
        const newIndex = activeTasks.findIndex(t => t.id === over.id);

        // Reorder the active tasks
        const reorderedActive = arrayMove(activeTasks, oldIndex, newIndex);

        // Combine back with completed tasks
        setTaskList([...reorderedActive, ...completedTasks]);
    }

    return (
        <div className="space-y-8">
            <TaskInput onAdd={addTaskToList}/>

            {/* Active Tasks */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                        Tasks
                    </h2>
                    {activeTasks.length > 0 && (
                        <span className="text-xs text-neutral-400">{activeTasks.length}</span>
                    )}
                </div>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={activeTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        <ul className="space-y-1">
                            {activeTasks.map(task => (
                                <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={removeTaskFromList}/>
                            ))}
                        </ul>
                    </SortableContext>
                </DndContext>
                {activeTasks.length === 0 && (
                    <p className="py-8 text-center text-sm text-neutral-400">
                        No tasks yet. Add one above to get started.
                    </p>
                )}
            </section>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                            Completed
                        </h2>
                        <span className="text-xs text-neutral-400">{completedTasks.length}</span>
                    </div>
                    <ul className="space-y-1">
                        {completedTasks.map(task => (
                            <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={removeTaskFromList}/>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    )
}