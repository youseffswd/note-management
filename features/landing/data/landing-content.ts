import { BookOpen, Folder, Heart, PencilLine, Sparkles } from "lucide-react";

export const steps = [
    {
        number: "01",
        icon: PencilLine,
        title: "Get it out of your head.",
        text: "A passing thought, a big plan, a tiny reminder. Open a note and let it all out.",
    },
    {
        number: "02",
        icon: Folder,
        title: "Give it a little structure.",
        text: "Find a home for your notes with folders and tags that make sense to you.",
    },
    {
        number: "03",
        icon: Sparkles,
        title: "Make space for what’s next.",
        text: "Come back to your ideas with a clear head. Pick up right where you left off.",
    },
];

export const questions = [
    {
        question: "What can I keep in NoteFlow?",
        answer: "Anything that starts with a thought: meeting notes, study guides, journal entries, project plans, reading lists, or everyday reminders. Use headings, lists, and checklists to give each note the shape it needs.",
    },
    {
        question: "How do I keep my notes organized?",
        answer: "Create folders and nested folders for different parts of your life. Add tags to connect related notes, star the ones you return to often, and search your workspace to find a note by its title.",
    },
    {
        question: "Do my notes save automatically?",
        answer: "Yes. NoteFlow saves your edits as you write and keeps a local draft in your browser to help recover unsaved changes. The editor shows your save status so you can see when your work has been saved.",
    },
    {
        question: "Can I use NoteFlow on my phone?",
        answer: "Yes. NoteFlow works in your browser and adapts to your phone, tablet, or computer, so you can open your workspace without installing another app.",
    },
    {
        question: "How do I get started?",
        answer: "Create a free account, open your workspace, and make your first note. Start with a blank page and build your own system as you go. You can also explore the sample workspace on this page before signing up.",
    },
];

export const useCases = [
    {
        icon: Folder,
        label: "FOR YOUR WORK",
        title: "Big plans, small steps.",
        text: "Meeting notes, project outlines, and your next lightbulb moment.",
        tags: ["project ideas", "meeting notes"],
    },
    {
        icon: Heart,
        label: "FOR YOUR LIFE",
        title: "A little more present.",
        text: "Daily reflections, weekend plans, and recipes worth keeping.",
        tags: ["journal", "little reminders"],
    },
    {
        icon: BookOpen,
        label: "FOR YOUR CURIOSITY",
        title: "Stay a little curious.",
        text: "Class notes, book takeaways, and things you want to explore.",
        tags: ["reading list", "new discoveries"],
    },
];
