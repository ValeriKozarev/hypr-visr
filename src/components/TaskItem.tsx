import type { Task } from '../types';

interface ITaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
}

export default function TaskItem({task, onToggle}: ITaskItemProps) {
    return (
        <div className='flex items-center gap-3 p-3 bg-gray-500 rounded-lg shadow-sm'>
            <input
                className='w-5 h-5'
                type="checkbox"
                checked={task.isDone}
                onChange={() => onToggle(task.id)}
            />
            {task.isDone ? <s><p>{task.title}</p></s> : <p>{task.title}</p>}
        </div>
    )
}