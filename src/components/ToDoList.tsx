import { useState } from "react";
import TaskItem from "./TaskItem";
import TaskInput from "./TaskInput";

import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

import { Task, Category, CATEGORIES } from '../types';

export default function ToDoList() {
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');

    function removeTaskFromList(id: number) {
        setTaskList(taskList.filter((task) => task.id !== id));
    }

    function addTaskToList(title: string, description?: string, category?: Category) {
        const newTask: Task = {
            id: Date.now(),
            title,
            isDone: false,
            description,
            category
        };
        setTaskList([newTask, ...taskList]);
    }

    function toggleTask(id: number) {
        setTaskList(taskList.map(task =>
            task.id === id
                ? { ...task, isDone: !task.isDone }
                : task
        ));
    }

    function updateTaskCategory(id: number, category: Category | undefined) {
        setTaskList(taskList.map(task =>
            task.id === id
                ? { ...task, category }
                : task
        ));
    }

    // Filter logic
    function filterTasks(tasks: Task[]) {
        return tasks.filter(task => {
            const matchesSearch = searchQuery === '' ||
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (task.description?.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory = categoryFilter === 'all' ||
                (categoryFilter === task.category);

            return matchesSearch && matchesCategory;
        });
    }

    const activeTasks = taskList.filter(t => !t.isDone);
    const completedTasks = taskList.filter(t => t.isDone);

    const filteredActiveTasks = filterTasks(activeTasks);
    const filteredCompletedTasks = filterTasks(completedTasks);

    const hasActiveFilters = searchQuery !== '' || categoryFilter !== 'all';

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = activeTasks.findIndex(t => t.id === active.id);
        const newIndex = activeTasks.findIndex(t => t.id === over.id);

        const reorderedActive = arrayMove(activeTasks, oldIndex, newIndex);
        setTaskList([...reorderedActive, ...completedTasks]);
    }

    return (
        <div className="space-y-6">
            <TaskInput onAdd={addTaskToList} />

            {/* Filters */}
            {taskList.length > 0 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {/* Search */}
                    <div className="relative flex-1">
                        <svg
                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm text-neutral-800 placeholder-neutral-400 transition-colors focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Category filter */}
                    <div className="flex flex-wrap gap-1">
                        <button
                            onClick={() => setCategoryFilter('all')}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                                categoryFilter === 'all'
                                    ? 'bg-neutral-800 text-white'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            }`}
                        >
                            All
                        </button>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setCategoryFilter(cat.id)}
                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                                    categoryFilter === cat.id
                                        ? `${cat.bgColor} ${cat.color} ${cat.borderColor}`
                                        : 'border-transparent bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Tasks */}
            <section>
                <div className="mb-3 flex items-center gap-2">
                    <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                        Tasks
                    </h2>
                    {filteredActiveTasks.length > 0 && (
                        <span className="text-xs text-neutral-400">
                            {filteredActiveTasks.length}
                            {hasActiveFilters && activeTasks.length !== filteredActiveTasks.length && (
                                <span className="text-neutral-300"> / {activeTasks.length}</span>
                            )}
                        </span>
                    )}
                </div>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={filteredActiveTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        <ul className="space-y-2">
                            {filteredActiveTasks.map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={toggleTask}
                                    onDelete={removeTaskFromList}
                                    onUpdateCategory={updateTaskCategory}
                                />
                            ))}
                        </ul>
                    </SortableContext>
                </DndContext>
                {filteredActiveTasks.length === 0 && (
                    <p className="py-8 text-center text-sm text-neutral-400">
                        {hasActiveFilters
                            ? 'No tasks match your filters.'
                            : 'No tasks yet. Add one above to get started.'}
                    </p>
                )}
            </section>

            {/* Completed Tasks */}
            {filteredCompletedTasks.length > 0 && (
                <section>
                    <div className="mb-3 flex items-center gap-2">
                        <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                            Completed
                        </h2>
                        <span className="text-xs text-neutral-400">
                            {filteredCompletedTasks.length}
                            {hasActiveFilters && completedTasks.length !== filteredCompletedTasks.length && (
                                <span className="text-neutral-300"> / {completedTasks.length}</span>
                            )}
                        </span>
                    </div>
                    <ul className="space-y-2">
                        {filteredCompletedTasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={toggleTask}
                                onDelete={removeTaskFromList}
                                onUpdateCategory={updateTaskCategory}
                            />
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
