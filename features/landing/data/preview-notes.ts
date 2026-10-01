export interface PreviewNote {
    id: string;
    title: string;
    folder: string;
    emoji: string;
    tag: string;
    subtitle: string;
    heading: string;
    body: string;
    tasks: string[];
    callout: string;
}

export const previewNotes: PreviewNote[] = [
    {
        id: "week",
        title: "A fresh start",
        folder: "Personal",
        emoji: "☀️",
        tag: "weekly reset",
        subtitle: "A little intention goes a long way.",
        heading: "Make room for the good stuff",
        body: "This week, I’m making a little more space for the things that matter. Less rushing. More creating. One small step at a time.",
        tasks: [
            "Get all those ideas out of my head",
            "Make time for a passion project",
            "Take a walk. Leave my phone at home.",
        ],
        callout: "You don’t have to do it all. Just start with one thing.",
    },
    {
        id: "ideas",
        title: "The idea garden",
        folder: "Projects",
        emoji: "🌱",
        tag: "ideas",
        subtitle: "Small ideas. Plenty of possibility.",
        heading: "Something worth making",
        body: "A home for the what-ifs, the shower thoughts, and the projects I can’t stop thinking about. They don’t need to be perfect to belong here.",
        tasks: [
            "Collect a few sparks of inspiration",
            "Sketch out the first version",
            "Choose one idea to bring to life",
        ],
        callout: "Every good project starts with a slightly messy note.",
    },
    {
        id: "learning",
        title: "Things I’m learning",
        folder: "Learning",
        emoji: "📚",
        tag: "curiosity",
        subtitle: "Follow your curiosity. Keep the good bits.",
        heading: "A little wiser, every day",
        body: "Interesting reads, useful lessons, and those little aha moments. A place to connect the dots and put what I learn into practice.",
        tasks: [
            "Save a takeaway from my latest read",
            "Explain a new idea in my own words",
            "Try something I haven’t done before",
        ],
        callout:
            "You don’t need to remember everything. That’s what notes are for.",
    },
];
