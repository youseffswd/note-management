import { ArrowDown, ArrowRight, Check } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { MotionArrow, MotionButtonLink } from "../motion/MotionControls";
import HeroDecorations from "./HeroDecorations";

export default function HeroSection() {
    return (
        <section
            className="relative mx-auto max-w-7xl scroll-mt-24 px-5 pt-16 pb-10 text-center outline-none sm:px-8 sm:pt-24 sm:pb-14"
            id="main-content"
            aria-labelledby="hero-title"
            tabIndex={-1}
        >
            <HeroDecorations />
            <Badge
                variant="outline"
                className="mb-7 h-auto gap-2 border-primary/20 bg-primary/5 px-3 py-2 text-[9px] font-medium tracking-widest text-primary sm:text-[10px]"
            >
                <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                A LITTLE SPACE FOR YOUR BIG IDEAS
            </Badge>
            <h1
                id="hero-title"
                className="text-5xl leading-[1.08] font-semibold tracking-tight sm:text-7xl lg:text-8xl"
            >
                Less scattered.
                <br />
                More{" "}
                <span className="bg-linear-to-r from-primary to-chart-5 bg-clip-text text-transparent">
                    collected.
                </span>
            </h1>
            <p className="mx-auto mt-7 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                Your thoughts deserve a home. Bring your notes, plans, and
                everyday ideas together in one delightfully simple space.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
                <MotionButtonLink
                    href="/sign-up"
                    size="lg"
                    className="group h-12 gap-3 px-5 sm:px-6"
                >
                    Find your flow
                    <MotionArrow>
                        <ArrowRight size={18} />
                    </MotionArrow>
                </MotionButtonLink>
                <MotionButtonLink
                    href="#preview"
                    variant="outline"
                    restBackground="var(--card)"
                    size="lg"
                    className="h-12 gap-3 bg-card px-5 sm:px-6"
                >
                    Take a little look
                    <MotionArrow direction="down">
                        <ArrowDown size={17} />
                    </MotionArrow>
                </MotionButtonLink>
            </div>
            <p className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground sm:text-xs">
                <Check
                    size={14}
                    className="text-chart-2"
                    aria-hidden="true"
                />
                Free to get started<span>·</span>Made for your everyday
            </p>
        </section>
    );
}
