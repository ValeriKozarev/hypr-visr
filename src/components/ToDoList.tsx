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
        <section className="max-w-md mx-auto p-6">
            <TaskInput onAdd={addTaskToList}/>
            
            <h2>Current Tasks</h2>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={activeTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <ul className="mt-4 space-y-2">
                        {activeTasks.map(task => (
                            <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={removeTaskFromList}/>
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
            <br />
            <h2>History</h2>
            <ul className="mt-4 space-y-2">
                {completedTasks.map(task => (
                    <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={removeTaskFromList}/>
                ))}
            </ul>
        </section>
    )
}