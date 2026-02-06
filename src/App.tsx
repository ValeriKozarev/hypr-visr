import { useState, useEffect, useRef } from "react";
import ToDoList from "./components/ToDoList";
import Header from "./components/Header";
import ListManager from "./components/ListManager";
import { invoke } from '@tauri-apps/api/core';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove} from '@dnd-kit/sortable';
import "./App.css";

import type { Task, ToDoList as ToDoListType, CategoryEnum } from "./types";

function App() {
    const hasLoaded = useRef(false);

    const [allToDoLists, setAllToDoLists] = useState<ToDoListType[]>([]);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);

    // computed the list thats selected so it plays nice with React
    const selectedList = allToDoLists.find(list => list.id === selectedListId);

    useEffect(() => {
        invoke<ToDoListType[]>('load_lists').then((lists) => {
            setAllToDoLists(lists);
            hasLoaded.current = true;  // Mark as loaded to avoid race condition
        });
    }, []);

    // Save when anything changes (but not before initial load)
    useEffect(() => {
        if (hasLoaded.current) {
            invoke('save_lists', { lists: allToDoLists });
        }
    }, [allToDoLists]);

    //#region Task operations
    function removeTaskFromList(id: number) {
        setAllToDoLists(lists => lists.map(list =>
            list.id === selectedListId
                ? { ...list, tasks: list.tasks.filter(t => t.id !== id) }                
                : list
        ));
    }

    function addTaskToList(title: string, description?: string, category?: CategoryEnum) {
        const newTask: Task = {
            id: Date.now(),
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

    function editTask(id: number, updates: Partial<Task>) {
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
    
    function toggleTask(id: number) {
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

    function handleDragEnd(event: DragEndEvent) {
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
    function addList(name: string) {
        const newList: ToDoListType = {
            id: Date.now(),
            name,
            tasks: []
        };
        setAllToDoLists(lists => [newList, ...lists, ]);
        setSelectedListId(newList.id);  // auto-select the new list
    }

    function deleteList(id: number) {
        setAllToDoLists(lists => lists.filter(list => list.id !== id));
        // If we deleted the selected list, clear selection
        if (selectedListId === id) {
            setSelectedListId(null);
        }
    }

    function renameList(id: number, name: string) {
        setAllToDoLists(lists => lists.map(list =>
            list.id === id ? { ...list, name } : list
        ));
    }
    //#region ToDoList operations

    //#endregion
    return (
        <div className="flex min-h-screen bg-zinc-900 text-neutral-100 antialiased">
            {/* Sidebar */}
            <aside className="w-64 shrink-0 border-r border-zinc-700/50 bg-zinc-950 p-4">
                <ListManager
                    lists={allToDoLists}
                    selectedListId={selectedListId}
                    onListSelect={setSelectedListId}
                    onAddList={addList}
                    onDeleteList={deleteList}
                    onRenameList={renameList}
                />
            </aside>

            {/* Main content */}
            <main className="flex-1 px-8 py-12">
                <div className="mx-auto max-w-2xl">
                    <Header />

                    {selectedList ? (
                        <ToDoList
                            list={selectedList}
                            onRemoveTask={removeTaskFromList}
                            onEditTask={editTask}
                            onAddTask={addTaskToList}
                            onToggleTask={toggleTask}
                            onDragTask={handleDragEnd}
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
