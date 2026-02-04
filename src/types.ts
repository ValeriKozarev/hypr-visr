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
        color: 'text-green-400',
        bgColor: 'bg-green-950/30',
        borderColor: 'border-green-500/50'
    },
    {
        id: 'tech',
        icon: '\u{1f4bb}',
        label: 'Tech',
        color: 'text-blue-400',
        bgColor: 'bg-blue-950/30',
        borderColor: 'border-blue-500/50'
    },
    {
        id: 'gearhead',
        icon: '\u{1f6e0}',
        label: 'Gearhead',
        color: 'text-orange-400',
        bgColor: 'bg-orange-950/30',
        borderColor: 'border-orange-500/50'
    },
];

export type Task = {
    id: number;
    title: string;
    isDone: boolean;
    description?: string;
    category?: CategoryEnum;
}
