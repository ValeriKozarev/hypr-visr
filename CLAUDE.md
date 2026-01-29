# hypr-visr

A personal todo/task management app inspired by Notion, built with Tauri + React.

## Project Overview

**Goal:** Create a local-first todo app with:
- Task creation with color coding/tags
- Drag and drop reordering
- Data stored locally (never lose your data)

## Technology Stack

- **Tauri** — Desktop app framework (Rust backend, web frontend)
- **React + TypeScript** — UI and all interactivity
- **Vite** — Build tool (Tauri's default)
- **SQLite or JSON files** — Local data persistence

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        REACT                                │
│                                                             │
│  • Rendering the todo list                                  │
│  • Drag and drop (dnd-kit or react-beautiful-dnd)           │
│  • Color picker / tag selection UI                          │
│  • Adding, editing, deleting tasks (in-memory state)        │
│  • Reordering logic                                         │
│  • Filtering by tag/color                                   │
│  • All animations and transitions                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                     ↓ invoke()  ↑                           │
├─────────────────────────────────────────────────────────────┤
│                        RUST                                 │
│                                                             │
│  • save_todos(todos) → writes to disk                       │
│  • load_todos() → reads from disk, returns to React         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**React handles:** All UI, state management, drag-and-drop, color/tag selection — ~95% of the code

**Rust handles:** Only persistence (read/write to disk) — minimal, ~15-30 lines

## Key Decisions

1. **Tauri over Electron** — Smaller binary, lower memory, uses system webview
2. **React for frontend** — Familiar ecosystem, good drag-and-drop libraries
3. **Minimal Rust** — Only for file I/O; all business logic stays in React
4. **Local-first** — Data stored on disk, no cloud dependency

## Project Structure (after scaffolding)

```
hypr-visr/
├── package.json
├── src/                  # React code
│   ├── App.tsx
│   ├── components/
│   └── ...
├── src-tauri/            # Rust code
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── src/
│       └── main.rs
└── vite.config.ts
```

## Next Steps

1. Scaffold the project: `npm create tauri-app@latest`
2. Build the React UI first (can use localStorage initially)
3. Add Rust persistence layer when ready
4. Implement drag-and-drop with dnd-kit or react-beautiful-dnd

## Notes

- Owner has React experience, new to Rust
- Start with React-only development, add Rust incrementally
- Keep Rust code minimal — just load/save functions
