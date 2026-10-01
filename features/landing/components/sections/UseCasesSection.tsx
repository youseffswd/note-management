import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { MotionButtonLink } from "../motion/MotionControls";
import { useCases } from "../../data/landing-content";
import { MotionCard, Reveal } from "../motion/LandingMotion";
import SectionHeading from "../SectionHeading";

export default function UseCasesSection() {
    return (
        <section
            className="mx-auto grid max-w-6xl scroll-mt-24 items-center gap-10 border-t border-border px-5 py-16 sm:px-8 md:grid-cols-2 md:gap-16 sm:py-24"
            id="your-space"
            aria-labelledby="use-cases-title"
        >
            <div className="text-center md:text-left">
                <SectionHeading
                    id="use-cases-title"
                    eyebrow="ONE SPACE. ALL YOUR SIDES."
                    align="left"
                    description="You’re more than your to-do list. Make room for your ambitions, your curiosities, and everything in between."
                >
                    For the work you do.
                    <br />
                    And the person
                    <br />
                    <span className="text-muted-foreground">you are.</span>
                </SectionHeading>
                <MotionButtonLink
                    href="/sign-up"
                    variant="link"
                    className="mt-5 h-auto gap-2 px-0"
                >
                    Make yourself at home
                    <ArrowUpRight size={18} aria-hidden="true" />
                </MotionButtonLink>
            </div>
            <div className="grid gap-4">
                {useCases.map(
                    ({ icon: Icon, label, title, text, tags }, index) => (
                        <Reveal key={label} delay={index * 0.04}>
                            <MotionCard className="rounded-xl border border-border bg-card p-5 text-card-foreground sm:p-6">
                                <span className="flex items-center gap-2 text-[10px] font-medium tracking-widest text-primary">
                                    <Icon size={16} aria-hidden="true" />
                                    {label}
                                </span>
                                <h3 className="mt-3 text-xl font-medium tracking-tight">
                                    {title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {text}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="rounded-md text-[10px]"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </MotionCard>
                        </Reveal>
                    ),
                )}
            </div>
        </section>
    );
}
