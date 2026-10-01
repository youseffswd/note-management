import { Asterisk, Lightbulb, Plus, Sparkles } from "lucide-react";
import FloatingDecoration from "../motion/FloatingDecoration";

export default function HeroDecorations() {
    return (
        <>
            <FloatingDecoration className="absolute top-44 left-10 hidden w-36 -rotate-12 rounded-xl border border-border bg-card p-5 text-primary shadow-xl lg:block">
                <Lightbulb size={25} strokeWidth={1.5} />
                <span className="mt-3 block text-left text-sm leading-relaxed text-secondary-foreground">
                    big ideas,
                    <br />
                    little notes.
                </span>
                <svg
                    className="mt-3 w-20 text-primary/50"
                    viewBox="0 0 100 20"
                    fill="none"
                >
                    <path
                        d="M4 10c27-10 54-9 89-2M13 17c21-8 50-8 72-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </FloatingDecoration>
            <FloatingDecoration
                duration={6}
                distance={18}
                className="absolute top-32 right-14 hidden text-chart-5 lg:block"
            >
                <Asterisk className="size-24" strokeWidth={1.3} />
            </FloatingDecoration>
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-60 right-6 hidden text-primary lg:block"
            >
                <Sparkles size={30} strokeWidth={1.5} />
            </div>
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-72 right-8 hidden w-40 rotate-12 text-sm leading-relaxed text-muted-foreground lg:block"
            >
                let your mind
                <br />
                wander a little
            </div>
            <FloatingDecoration
                duration={4.5}
                distance={8}
                className="pointer-events-none absolute top-5 left-6 text-chart-5/60 sm:top-10 sm:left-1/4"
            >
                <Sparkles className="size-5 sm:size-7" strokeWidth={1.3} />
            </FloatingDecoration>
            <FloatingDecoration
                duration={5}
                distance={10}
                className="pointer-events-none absolute top-7 right-7 text-primary/60 sm:top-12 sm:right-1/4"
            >
                <Plus className="size-5 sm:size-7" strokeWidth={1.3} />
            </FloatingDecoration>
        </>
    );
}
