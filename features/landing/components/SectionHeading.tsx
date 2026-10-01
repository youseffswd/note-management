import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { Reveal } from "./motion/LandingMotion";

interface SectionHeadingProps {
    id: string;
    eyebrow: string;
    children: ReactNode;
    description?: string;
    align?: "center" | "left";
}

export default function SectionHeading({
    id,
    eyebrow,
    children,
    description,
    align = "center",
}: SectionHeadingProps) {
    return (
        <Reveal
            className={cn(
                "mb-10 text-center",
                align === "left" && "md:text-left",
            )}
        >
            <span className="mb-4 block text-[10px] font-medium tracking-widest text-primary">
                {eyebrow}
            </span>
            <h2
                id={id}
                className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl"
            >
                {children}
            </h2>
            {description && (
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {description}
                </p>
            )}
        </Reveal>
    );
}
