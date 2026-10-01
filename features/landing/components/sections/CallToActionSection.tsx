import { ArrowRight, Asterisk, Heart } from "lucide-react";
import { MotionArrow, MotionButtonLink } from "../motion/MotionControls";
import { Reveal } from "../motion/LandingMotion";
import FloatingDecoration from "../motion/FloatingDecoration";

export default function CallToActionSection() {
    return (
        <Reveal>
            <section
                className="relative mx-4 mb-16 overflow-hidden rounded-2xl border border-border bg-card px-5 py-14 text-center sm:mx-8 sm:py-16 xl:mx-auto xl:max-w-6xl"
                aria-labelledby="cta-title"
            >
                <FloatingDecoration
                    duration={6}
                    distance={16}
                    className="absolute top-1/2 left-12 hidden -translate-y-1/2 text-primary/60 lg:block"
                >
                    <Asterisk className="size-24" strokeWidth={1} />
                </FloatingDecoration>
                <span className="mb-5 block text-[10px] font-medium tracking-widest text-primary">
                    YOUR NEXT CHAPTER STARTS HERE
                </span>
                <h2
                    id="cta-title"
                    className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl"
                >
                    A little less noise.
                    <br />A lot more <span className="text-primary">you.</span>
                </h2>
                <p className="mx-auto mt-5 max-w-xs text-sm leading-7 text-muted-foreground sm:max-w-none">
                    Give your ideas a home. See where they take you.
                </p>
                <MotionButtonLink
                    href="/sign-up"
                    size="lg"
                    className="group mt-7 h-12 gap-3 px-6"
                >
                    Start your first note
                    <MotionArrow>
                        <ArrowRight size={18} />
                    </MotionArrow>
                </MotionButtonLink>
                <span className="mt-4 block text-xs text-muted-foreground">
                    A blank page. A fresh start. Free to begin.
                </span>
                <FloatingDecoration
                    duration={6.5}
                    className="pointer-events-none absolute top-1/2 right-14 hidden w-28 -translate-y-1/2 rotate-12 rounded-xl border border-border bg-secondary p-5 text-chart-5 lg:block"
                >
                    <Heart size={24} strokeWidth={1.5} />
                    <span className="mt-3 block text-left text-sm leading-relaxed text-secondary-foreground">
                        good things
                        <br />
                        start here.
                    </span>
                </FloatingDecoration>
            </section>
        </Reveal>
    );
}
