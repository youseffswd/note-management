"use client";

import { useLandingReducedMotion } from "../../hooks/use-landing-reduced-motion";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { questions } from "../../data/landing-content";
import SectionHeading from "../SectionHeading";
import { Reveal } from "../motion/LandingMotion";

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const reducedMotion = useLandingReducedMotion();

    return (
        <section
            className="mx-auto grid max-w-6xl scroll-mt-24 gap-10 border-t border-border px-5 py-16 sm:px-8 sm:py-24 md:grid-cols-[0.8fr_1.2fr] md:gap-16"
            id="questions"
            aria-labelledby="faq-title"
        >
            <div>
                <SectionHeading
                    id="faq-title"
                    eyebrow="A FEW LITTLE ANSWERS"
                    align="left"
                    description="Here’s a little more about finding your flow."
                >
                    Curious?
                    <br />
                    <span className="text-muted-foreground">We like that.</span>
                </SectionHeading>
                <Sparkles
                    className="hidden text-chart-5 md:block"
                    size={42}
                    strokeWidth={1.1}
                    aria-hidden="true"
                />
            </div>
            <Reveal className="border-t border-border">
                {questions.map(({ question, answer }, index) => {
                    const isOpen = openIndex === index;
                    const answerId = `faq-answer-${index}`;
                    const questionId = `faq-question-${index}`;

                    return (
                        <div className="border-b border-border" key={question}>
                            <h3>
                                <motion.button
                                    type="button"
                                    id={questionId}
                                    aria-expanded={isOpen}
                                    aria-controls={answerId}
                                    onClick={() =>
                                        setOpenIndex(isOpen ? null : index)
                                    }
                                    className="flex min-h-18 w-full cursor-pointer items-center justify-between gap-4 py-5 text-left text-sm font-medium outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring"
                                    initial={false}
                                    animate={{
                                        color: isOpen
                                            ? "var(--primary)"
                                            : "var(--foreground)",
                                    }}
                                    whileHover={{ color: "var(--primary)" }}
                                    whileFocus={{ color: "var(--primary)" }}
                                    transition={{
                                        duration: reducedMotion ? 0 : 0.16,
                                    }}
                                >
                                    {question}
                                    <motion.span
                                        className="inline-flex shrink-0 text-muted-foreground"
                                        initial={false}
                                        animate={{ rotate: isOpen ? 45 : 0 }}
                                        transition={{
                                            duration: reducedMotion ? 0 : 0.16,
                                        }}
                                        aria-hidden="true"
                                    >
                                        <Plus size={19} />
                                    </motion.span>
                                </motion.button>
                            </h3>
                            <motion.div
                                id={answerId}
                                role="region"
                                aria-labelledby={questionId}
                                aria-hidden={!isOpen}
                                inert={!isOpen}
                                initial={false}
                                animate={{
                                    height: isOpen ? "auto" : 0,
                                    opacity: isOpen ? 1 : 0,
                                }}
                                transition={{
                                    duration: reducedMotion ? 0 : 0.25,
                                }}
                                className="overflow-hidden"
                            >
                                <p className="pr-5 pb-6 text-sm leading-7 text-muted-foreground">
                                    {answer}
                                </p>
                            </motion.div>
                        </div>
                    );
                })}
            </Reveal>
        </section>
    );
}
