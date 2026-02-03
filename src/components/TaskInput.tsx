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
                className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                type="text"
                placeholder="Create new task..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <button 
                className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
                onClick={addTask}
            >
                Add Task
            </button>
        </div>
    );
}