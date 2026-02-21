export type CategoryEnum = string;

export type Category = {
    id: CategoryEnum,
    icon: string,
    label: string,
    color: string,
    bgColor: string,
    borderColor: string
}

export type Task = {
    id: number;
    title: string;
    isDone: boolean;
    description?: string;
    category?: CategoryEnum;
}

export type ToDoList = {
    id: number;
    name: string;
    tasks: Task[];
}
