import { useState } from "react";
import { generateSubtitle } from "../utils/generateSubtitle";

export default function Header() {
    const [subtitle, setSubtitle] = useState('');

    // TODO: is there a way to write this in more idiomatic React?
    if (subtitle === '') {
        setSubtitle(generateSubtitle())
    }

    return (
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
            <p className="mt-2 text-sm text-amber-400/70">{subtitle}</p>
        </header>
    )
}