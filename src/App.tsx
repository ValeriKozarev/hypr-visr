import ToDoList from "./components/ToDoList";
import "./App.css";

function App() {
  return (
    <main className="min-h-screen bg-zinc-900 text-neutral-100 antialiased">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
            hypr-visr
          </h1>
          <p className="mt-1 text-sm text-amber-400/70">Let's get this shit.</p>
        </header>
        <ToDoList />
      </div>
    </main>
  );
}

export default App;
