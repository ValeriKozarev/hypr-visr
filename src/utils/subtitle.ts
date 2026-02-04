const SUBTITLES = [
    "Let's get this shit.",
    "It's all mindset.",
    "Stay focused.",
    "Focus on the things that you can control."
]

export function pickSubtitle() {
    const randomIndex = Math.floor(Math.random() * SUBTITLES.length);
    return SUBTITLES[randomIndex];
}