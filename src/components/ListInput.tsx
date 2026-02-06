export default function ListInput({ onAddList }: { onAddList: (name: string) => void }) {
    return (
        <input
            className="w-full rounded border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-neutral-100 mb-2 placeholder-neutral-500 transition-colors focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
            placeholder="+ New list"
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    const value = input.value.trim();
                    if (value) {
                        onAddList(value);
                        input.value = '';
                    }
                }
            }}
        />
    )
}
