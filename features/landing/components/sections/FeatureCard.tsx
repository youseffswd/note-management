import type { ReactNode } from "react";
import { MotionCard, Reveal } from "../motion/LandingMotion";

interface FeatureCardProps {
    icon: ReactNode;
    title: ReactNode;
    description: string;
    children: ReactNode;
    delay?: number;
}

export default function FeatureCard({
    icon,
    title,
    description,
    children,
    delay = 0,
}: FeatureCardProps) {
    return (
        <Reveal className="h-full min-w-0" delay={delay}>
            <MotionCard className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card p-6 pb-0 text-card-foreground">
                <div className="mb-5 w-fit">{icon}</div>
                <h3 className="text-2xl leading-tight font-medium tracking-tight">
                    {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {description}
                </p>
                {children}
            </MotionCard>
        </Reveal>
    );
}
