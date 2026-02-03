import { useState } from 'react';

interface ITaskInputProps {
    onAdd: (title: string) => void;
}

export default function TaskInput(props: ITaskInputProps) {
    const [taskTitle, setTaskTitle] = useState('');

    function addTask() {
        if (taskTitle.trim()) {
            props.onAdd(taskTitle);
            setTaskTitle('');
        }
    }

    return (
        <div className="flex gap-2">
            <input
                className="flex-1 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 shadow-sm transition-colors focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                type="text"
                placeholder="Add a new task..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <button
                className="rounded-lg bg-neutral-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:opacity-50"
                onClick={addTask}
                disabled={!taskTitle.trim()}
            >
                Add
            </button>
        </div>
    );
}