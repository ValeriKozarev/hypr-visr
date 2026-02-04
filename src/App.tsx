import ToDoList from "./components/ToDoList";
import "./App.css";

function App() {
  return (
    <main className="min-h-screen bg-zinc-600 text-neutral-800 antialiased">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-amber-400">
            hypr-visr
          </h1>
          <p className="mt-1 text-sm text-amber-400">Let's get this shit.</p>
        </header>
        <ToDoList />
      </div>
    </main>
  );
}

export default App;
