
import { EMOJI_OPTIONS } from "../utils/emojis";
import PickerDropdown from "./PickerDropdown";

interface IEmojiPickerProps {
    value: string | undefined;
    onChange: (emoji: string) => void;
    defaultEmoji?: string;
}

export default function EmojiPicker({value, onChange, defaultEmoji = '📝'}: IEmojiPickerProps) {
    return (
        <PickerDropdown
            value={value}
            options={EMOJI_OPTIONS}
            onChange={onChange}
            renderTrigger={(emoji, isOpen) => (
                <button className='flex h-10 w-10 items-center justify-center rounded border border-zinc-600 bg-zinc-800 text-xl transition-colors hover:bg-zinc-700 hover:border-amber-400/50'>
                    {emoji || defaultEmoji}
                </button>
            )}
            renderOption={(emoji) => (
                <span>
                    {emoji}
                </span>
            )}
            align="left"
        />
    )
}