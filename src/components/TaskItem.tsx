import type { Task } from '../types';

interface ITaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
}

export default function TaskItem({task, onToggle}: ITaskItemProps) {
    return (
        <div>
            <input 
                type="checkbox"
                checked={task.isDone}
                onChange={() => onToggle(task.id)}
            />
            {task.isDone ? <s><p>{task.title}</p></s> : <p>{task.title}</p>}
        </div>
    )
}