export type CategoryEnum = 'personal' | 'tech' | 'gearhead';

export type Category = {
    id: CategoryEnum,
    icon: string,
    label: string,
    color: string,
    bgColor: string,
    borderColor: string
}

export const CATEGORIES: Category[] = [
    { 
        id: 'personal', 
        icon: '\u{1f486}\u{200d}\u{2642}\u{fe0f}',
        label: 'Personal', 
        color: 'text-green-700', 
        bgColor: 'bg-green-50', 
        borderColor: 'border-green-200' 
    },
    { 
        id: 'tech', 
        icon: '\u{1f4bb}',
        label: 'Tech', 
        color: 'text-blue-700', 
        bgColor: 'bg-blue-50', 
        borderColor: 'border-blue-200' },
    { 
        id: 'gearhead', 
        icon: '\u{1f6e0}',
        label: 'Gearhead', 
        color: 'text-orange-700', 
        bgColor: 'bg-orange-50', 
        borderColor: 'border-orange-200' 
    },
];

export type Task = {
    id: number;
    title: string;
    isDone: boolean;
    description?: string;
    category?: CategoryEnum;
}
