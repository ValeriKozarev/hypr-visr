const SUBTITLES = [
    "Let's get this shit.",
    "All mindset.",
    "Stay focused.",
    "Focus on the things that you can control.",
    "Keep moving.",
    "Probably time to pick up another hobby...",
    "Now with 50% more amber!",
    "New look, same great taste!",
    "Even a broken clock is right twice a day!",
    "When in doubt, make another list.",
    "Notion did it better!",
    "My other to-do list is a notepad.",
    "Don't worry, you'll get it done.",
    "Small wins add up!",
    "Momentum is real, don't stop now!",
    "Strong leaders think about creating systems.",
    "Completing a task is good, building a habit is better.",
]

export function generateSubtitle() {
    const randomIndex = Math.floor(Math.random() * SUBTITLES.length);
    return SUBTITLES[randomIndex];
}