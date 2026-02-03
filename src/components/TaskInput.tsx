import { useRef } from 'react';

interface ITaskInputProps {
    onAdd: (title: string) => void;
}

export default function TaskInput(props: ITaskInputProps) {
    const taskTitle = useRef<HTMLInputElement>(null);

    function addTask() {
        if (taskTitle.current?.value) {
            props.onAdd(taskTitle.current.value);
        }
    }

    return (
        <>
            <input 
                type="text"
                placeholder="Create new task..."
                ref={taskTitle}
            />
            <button onClick={() => addTask()}>Add Task</button>
        </>
    );
}