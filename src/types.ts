export type Category = 'personal' | 'tech' | 'vehicle';

export const CATEGORIES: { id: Category; label: string; color: string; bgColor: string; borderColor: string }[] = [
    { id: 'personal', label: 'Personal', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { id: 'tech', label: 'Tech', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { id: 'vehicle', label: 'Vehicle', color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
];

export type Task = {
    id: number;
    title: string;
    isDone: boolean;
    description?: string;
    category?: Category;
}
