import { steps } from "../../data/landing-content";
import { Reveal } from "../motion/LandingMotion";
import SectionHeading from "../SectionHeading";

export default function HowItWorksSection() {
    return (
        <section
            className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-2 pb-16 sm:px-8 sm:pb-24"
            id="how-it-works"
            aria-labelledby="how-title"
        >
            <SectionHeading
                id="how-title"
                eyebrow="A SMALL START GOES A LONG WAY"
            >
                From a busy mind
                <br />
                to a blank page.{" "}
                <span className="text-muted-foreground">And beyond.</span>
            </SectionHeading>
            <div className="grid gap-8 md:grid-cols-3 md:gap-12">
                {steps.map(({ number, icon: Icon, title, text }, index) => (
                    <Reveal key={number} delay={index * 0.07}>
                        <article>
                            <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
                                <span className="font-mono text-2xl text-primary">
                                    {number}
                                </span>
                                <Icon
                                    size={25}
                                    className="text-muted-foreground"
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                />
                            </div>
                            <h3 className="text-base font-medium">{title}</h3>
                            <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                {text}
                            </p>
                        </article>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
