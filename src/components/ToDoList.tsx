import { useState } from "react";
import TaskItem from "./TaskItem";
import TaskInput from "./TaskInput";

import type { Task } from '../types';

export default function ToDoList() {
    const [taskList, setTaskList] = useState<Task[]>([]);

    function addTaskToList(taskTitle: string) {
        const newTask: Task = {
            id: Date.now(), // TODO: improve this later
            title: taskTitle,
            isDone: false
        }
        const newTaskList = [...taskList, newTask];
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
        <>
            <TaskInput onAdd={addTaskToList}/>
            <ul>
                {taskList.map(task => (
                    <TaskItem key={task.id} task={task} onToggle={toggleTask}/>
                ))}
            </ul>
        </>
    )
}