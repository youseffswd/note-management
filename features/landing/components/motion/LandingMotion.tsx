"use client";

import type { ReactNode } from "react";
import { motion, MotionConfig } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { useLandingReducedMotion } from "../../hooks/use-landing-reduced-motion";
import { useSmoothSectionScroll } from "../../hooks/use-smooth-section-scroll";

interface MotionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function LandingMotion({ children, className }: Omit<MotionProps, "delay">) {
    const onSectionClick = useSmoothSectionScroll();

    return (
        <MotionConfig
            reducedMotion="user"
            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
        >
            <div
                className={className}
                onClick={onSectionClick}
                data-landing-page=""
            >
                <noscript>
                    <style>{`[data-landing-reveal] { opacity: 1 !important; transform: none !important; }`}</style>
                </noscript>
                {children}
            </div>
        </MotionConfig>
    );
}

/** Reveal once on entry, with no scroll listeners or repeated hide/show cycles. */
export function Reveal({ children, className, delay = 0 }: MotionProps) {
    const reducedMotion = useLandingReducedMotion();

    return (
        <motion.div
            className={cn(
                "motion-reduce:transform-none! motion-reduce:opacity-100! focus-within:transform-none! focus-within:opacity-100!",
                className,
            )}
            data-landing-reveal=""
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12, margin: "0px 0px -24px 0px" }}
            transition={{
                type: "tween",
                duration: reducedMotion ? 0 : 0.5,
                delay: reducedMotion ? 0 : Math.min(delay, 0.16),
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    );
}

export function MotionCard({ children, className }: Omit<MotionProps, "delay">) {
    const reducedMotion = useLandingReducedMotion();

    return (
        <motion.article
            className={className}
            initial={false}
            animate={{ y: 0, borderColor: "var(--border)" }}
            whileHover={{
                y: reducedMotion ? 0 : -3,
                borderColor: "var(--primary)",
            }}
            transition={{
                type: "tween",
                duration: reducedMotion ? 0 : 0.18,
                ease: "easeOut",
            }}
        >
            {children}
        </motion.article>
    );
}
