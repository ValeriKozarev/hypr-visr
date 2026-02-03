import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { Task } from '../types';

interface ITaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function TaskItem({task, onToggle, onDelete}: ITaskItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className='flex items-center gap-3 p-3 bg-gray-500 rounded-lg shadow-sm'
        >
    
            {/* Drag handle - only this is draggable */}
            {!task.isDone && <span {...listeners} className="cursor-grab">
                ⠿
            </span>}

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