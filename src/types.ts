export type Category = {
    id: string,
    icon: string,
    label: string,
    color: string,
    bgColor: string,
    borderColor: string
}

export type Task = {
    id: string;
    title: string;
    isDone: boolean;
    description?: string;
    category?: string;
}

export type ToDoList = {
    id: string;
    name: string;
    tasks: Task[];
}
