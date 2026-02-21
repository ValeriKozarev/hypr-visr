
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
                <button className='p-2 hover:bg-amber-400'>
                    {emoji || defaultEmoji}
                </button>
            )}
            renderOption={(emoji) => (
                <span>
                    {emoji}
                </span>
            )}
        />
    )
}