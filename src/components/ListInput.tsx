import { useState } from "react";
import EmojiPicker from "./EmojiPicker";

interface IListInputProps {
    onAddList: (name: string, icon?: string) => void;
}

export default function ListInput({ onAddList }: IListInputProps) {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState<string>('📜');

    function handleSubmit() {
        if (name.trim()) {
            onAddList(name.trim(), icon);
            setName('');
            setIcon('📜');
        }
    }
    
    return (
        <div className="mb-2 flex gap-2">
            <EmojiPicker
                value={icon}
                onChange={setIcon}
                defaultEmoji="📜"
            />

            <input
                className="min-w-0 flex-1 rounded border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 transition-colors focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
                placeholder="+ New list"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSubmit();
                    }
                }}
            />
        </div>
    )
}
