"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { useLandingReducedMotion } from "../../hooks/use-landing-reduced-motion";

interface FloatingDecorationProps {
    children: ReactNode;
    className?: string;
    duration?: number;
    distance?: number;
}

export default function FloatingDecoration({
    children,
    className,
    duration = 5.5,
    distance = 16,
}: FloatingDecorationProps) {
    const reducedMotion = useLandingReducedMotion();

    return (
        <motion.div
            className={cn(
                "pointer-events-none select-none motion-reduce:transform-none!",
                className,
            )}
            initial={false}
            animate="rest"
            whileInView={reducedMotion ? "rest" : "float"}
            viewport={{ amount: "some" }}
            variants={{
                rest: {
                    y: 0,
                    rotate: 0,
                    transition: { duration: reducedMotion ? 0 : 0.3 },
                },
                float: {
                    y: [0, -distance, 0],
                    rotate: [0, 2, 0],
                    transition: {
                        duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                    },
                },
            }}
            aria-hidden="true"
            data-floating=""
        >
            {children}
        </motion.div>
    );
}
