interface WeightedSubtitle {
    text: string,
    weight: number
}

const SUBTITLES: WeightedSubtitle[] = [
    // weight 10 - ~56% chance
    { text: "All mindset.", weight: 10 },
    { text: "Stay focused.", weight: 10 },
    { text: "Focus on the things that you can control.", weight: 10 },
    { text: "Keep moving.", weight: 10 },
    { text: "Small wins add up!", weight: 10 },
    { text: "Momentum is real, don't stop now!", weight: 10 },
    { text: "Completing a task is good, building a habit is better.", weight: 10 },
    { text: "Don't worry, you'll get it done.", weight: 10 },

    // weight 5 - ~28% chance
    { text: "Probably time to pick up another hobby...", weight: 5 },
    { text: "Now with 50% more amber!", weight: 5 },
    { text: "New look, same great taste!", weight: 5 },
    { text: "When in doubt, make another list.", weight: 5 },
    { text: "My other to-do list is a notepad.", weight: 5 },
    { text: "Notion did it better!", weight: 5 },


    // weight 1 - ~6% chance
    { text: "Even a broken clock is right twice a day!", weight: 1 },
    { text: "Let's get this shit.", weight: 1 },
    { text: "Are ya winnin', son?", weight: 1 },
];

export function generateSubtitle(): string {
    const totalWeight = SUBTITLES.reduce((sum, item) => sum + item.weight, 0);

    let random = Math.random() * totalWeight;

    for (const subtitle of SUBTITLES) {
        random -= subtitle.weight;
        if (random <= 0) {
            return subtitle.text;
        }
    }

    // Fallback (shouldn't happen)
    return SUBTITLES[0].text;
}