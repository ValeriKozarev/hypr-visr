import { useState, useEffect, useRef } from "react";
import ToDoList from "./components/ToDoList";
import Header from "./components/Header";
import ListManager from "./components/ListManager";
import { invoke } from '@tauri-apps/api/core';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove} from '@dnd-kit/sortable';
import { generateId } from './utils/generateId';
import "./App.css";

import type { Task, ToDoList as ToDoListType, Category } from "./types";

function App() {
    const hasLoaded = useRef(false);

    const [allToDoLists, setAllToDoLists] = useState<ToDoListType[]>([]);
    const [selectedListId, setSelectedListId] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showSplash, setShowSplash] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(320);
    const [isResizing, setIsResizing] = useState(false);

    // some constraints for how much you can resize
    const MIN_WIDTH = 240;
    const MAX_WIDTH = 360;

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;

            const newWidth = e.clientX;
            if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
                setSidebarWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            // Prevent text selection during resize
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'col-resize';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
    }, [isResizing, MIN_WIDTH, MAX_WIDTH])

    useEffect(() => {
        const minDelay = new Promise(resolve => setTimeout(resolve, 1500));
        const dataLoad = invoke<{ categories: Category[], lists: ToDoListType[] }>('load_app_data');

        // Wait for BOTH minimum time AND data to load
        Promise.all([minDelay, dataLoad]).then(([, data]) => {
            setCategories(data.categories);
            setAllToDoLists(data.lists);
            hasLoaded.current = true;
            setShowSplash(false);
        });
    }, []);

    // Save when anything changes (but not before initial load)
    useEffect(() => {
        if (hasLoaded.current) {
            invoke('save_app_data', { categories, lists: allToDoLists });
        }
    }, [allToDoLists, categories]);

    // computed the list thats selected so it plays nice with React
    const selectedList = allToDoLists.find(list => list.id === selectedListId);

    //#region Task operations
    function removeTaskFromList(id: string) {
        setAllToDoLists(lists => lists.map(list =>
            list.id === selectedListId
                ? { ...list, tasks: list.tasks.filter(t => t.id !== id) }                
                : list
        ));
    }

    function addTaskToList(title: string, description?: string, category?: string) {
        const newTask: Task = {
            id: generateId(),
            title,
            isDone: false,
            description,
            category
        };
        setAllToDoLists(lists => lists.map(list =>
            list.id === selectedListId
                ? { ...list, tasks: [newTask, ...list.tasks] }
                : list
        ));
    }

    function editTask(id: string, updates: Partial<Task>) {
        setAllToDoLists(lists => lists.map(list => {
            if (list.id !== selectedListId) return list;

            return {
                ...list,
                tasks: list.tasks.map(task => {
                    return task.id === id ? { ...task, ...updates } : task
                })
            }
        }));
    }
    
    function toggleTask(id: string) {
        setAllToDoLists(lists => lists.map(list => {
            if (list.id !== selectedListId) return list;

            const task = list.tasks.find(t => t.id === id);
            if (!task) return list;

            const isNowDone = !task.isDone;
            const updatedTask = { ...task, isDone: isNowDone };
            const otherTasks = list.tasks.filter(t => t.id !== id);

            const active = otherTasks.filter(t => !t.isDone);
            const completed = otherTasks.filter(t => t.isDone);

            const newTasks = isNowDone
                ? [...active, updatedTask, ...completed]
                : [updatedTask, ...active, ...completed];

            return { ...list, tasks: newTasks };
        }));
    }

    function handleTaskDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setAllToDoLists(lists => lists.map(list => {
            if (list.id !== selectedListId) return list;

            const activeTasks = list.tasks.filter(t => !t.isDone);
            const completedTasks = list.tasks.filter(t => t.isDone);

            const oldIndex = activeTasks.findIndex(t => t.id === active.id);
            const newIndex = activeTasks.findIndex(t => t.id === over.id);

            const reorderedActive = arrayMove(activeTasks, oldIndex, newIndex);
            return { ...list, tasks: [...reorderedActive, ...completedTasks] };
        }));
    }
    //#endregion
    //#region List operations
    function addList(name: string, icon?: string) {
        const newList: ToDoListType = {
            id: generateId(),
            name,
            icon,
            tasks: []
        };
        setAllToDoLists(lists => [newList, ...lists, ]);
        setSelectedListId(newList.id);  // auto-select the new list
    }

    function deleteList(id: string) {
        setAllToDoLists(lists => lists.filter(list => list.id !== id));
        // If we deleted the selected list, clear selection
        if (selectedListId === id) {
            setSelectedListId(null);
        }
    }

    function renameList(id: string, name: string, icon?: string) {
        setAllToDoLists(lists => lists.map(list =>
            list.id === id ? { ...list, name, icon } : list
        ));
    }

    function handleListDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = allToDoLists.findIndex(l => l.id === active.id);
        const newIndex = allToDoLists.findIndex(l => l.id === over.id);

        setAllToDoLists(arrayMove(allToDoLists, oldIndex, newIndex));
    }
    //#endregion

    //#region Category operations
    function addCategory(category: Category) {
        setCategories(categories => [...categories, category])
    }

    function deleteCategory(id: string) {
        setCategories(categories => categories.filter(category => category.id !== id))

        // dont forget to update tasks that use this category
        setAllToDoLists(lists => lists.map(list => ({
                ...list,
                tasks: list.tasks.map(task =>
                    task.category === id ? {...task, category: undefined} : task
                )
            })
        ));
    }
    //#endregion

    // loading splash screen
    if (showSplash) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-900">
                <img src="/splash.svg" alt="Loading..." className="h-auto w-full max-w-2xl" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-zinc-900 text-neutral-100 antialiased">
            <aside className="shrink-0 border-r border-zinc-700/50 bg-zinc-950 p-4 overflow-y-auto" style={{width: `${sidebarWidth}px`}}>
                <ListManager
                    lists={allToDoLists}
                    selectedListId={selectedListId}
                    onListSelect={setSelectedListId}
                    onDragList={handleListDragEnd}
                    onAddList={addList}
                    onDeleteList={deleteList}
                    onRenameList={renameList}
                />
            </aside>

            <div
                onMouseDown={handleMouseDown}
                className={`w-1 hover:w-2 cursor-col-resize transition-all ${
                    isResizing
                        ? 'bg-amber-400 w-2'
                        : 'bg-zinc-700/30 hover:bg-amber-400/50'
                }`}
            />

            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-2xl px-8 py-12">
                    <Header />

                    {selectedList ? (
                        <ToDoList
                            list={selectedList}
                            onRemoveTask={removeTaskFromList}
                            onEditTask={editTask}
                            onAddTask={addTaskToList}
                            onToggleTask={toggleTask}
                            onDragTask={handleTaskDragEnd}
                            categories={categories}
                            onAddCategory={addCategory}
                            onDeleteCategory={deleteCategory}
                        />
                    ) : (
                        <div className="rounded border border-zinc-700 bg-zinc-800/50 py-16 text-center">
                            <p className="text-neutral-500">
                                {allToDoLists.length === 0
                                    ? "Create a list to get started"
                                    : "Select a list"}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
