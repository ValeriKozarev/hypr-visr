import type { Task } from '../types';

interface ITaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function TaskItem({task, onToggle, onDelete}: ITaskItemProps) {
    return (
        <div className='flex items-center gap-3 p-3 bg-gray-500 rounded-lg shadow-sm'>
            <input
                className='w-5 h-5'
                type="checkbox"
                checked={task.isDone}
                onChange={() => onToggle(task.id)}
            />
            <span className={task.isDone ? "line-through text-gray-400" : ""}>
                {task.title}
            </span>            
            <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
    )
}