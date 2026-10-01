import { Hash, Lightbulb, PencilLine, Plus, Sparkles, Star } from "lucide-react";

const accents = [
    {
        icon: PencilLine,
        position: "top-[17%] left-[3%] text-primary/50",
    },
    {
        icon: Sparkles,
        position: "top-[24%] right-[4%] text-chart-5/60",
    },
    {
        icon: Hash,
        position: "top-[33%] left-[4%] text-chart-2/50",
    },
    {
        icon: Star,
        position: "top-[40%] right-[3%] text-chart-3/50",
    },
    {
        icon: Lightbulb,
        position: "top-[49%] left-[3%] text-chart-5/50",
    },
    {
        icon: Plus,
        position: "top-[81%] left-[4%] text-primary/50",
    },
];

export default function PageDecorations() {
    return (
        <div
            className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden xl:block"
            aria-hidden="true"
        >
            {accents.map(({ icon: Icon, position }) => (
                <div key={position} className={`absolute ${position}`}>
                    <Icon className="size-8 2xl:size-11" strokeWidth={1.2} />
                </div>
            ))}
        </div>
    );
}
