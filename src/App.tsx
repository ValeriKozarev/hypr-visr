import ToDoList from "./components/ToDoList";
import "./App.css";

function App() {
  return (
    <main className="min-h-screen bg-zinc-900 text-neutral-100 antialiased">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-4">
            <h1 className="font-tech text-6xl uppercase text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" style={{ letterSpacing: '-0.05em', transform: 'skewX(-8deg)' }}>
              hypr-visr
            </h1>
            <img
              src="/Superintendant-alone.svg"
              alt="Superintendent"
              className="h-14 w-14 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"
            />
          </div>
          <p className="mt-2 text-sm text-amber-400/70">Let's get this shit.</p>
        </header>
        <ToDoList />
      </div>
    </main>
  );
}

export default App;
