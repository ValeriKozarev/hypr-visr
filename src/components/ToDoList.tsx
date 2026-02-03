import { useState } from "react";
import TaskItem from "./TaskItem";
import TaskInput from "./TaskInput";

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

    return (
        <section className="max-w-md mx-auto p-6">
            <h2>Current Tasks</h2>
            <TaskInput onAdd={addTaskToList}/>
            <ul className="mt-4 space-y-2">
                {taskList.filter(task => !task.isDone).map(task => (
                    <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={removeTaskFromList}/>
                ))}
            </ul>
            <br />
            <h2>History</h2>
            <ul className="mt-4 space-y-2">
                {taskList.filter(task => task.isDone).map(task => (
                    <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={removeTaskFromList}/>
                ))}
            </ul>
        </section>
    )
}