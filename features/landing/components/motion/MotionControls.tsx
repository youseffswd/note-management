"use client";

import type { ComponentProps, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { useLandingReducedMotion } from "../../hooks/use-landing-reduced-motion";

// Create these once so interactions never remount their underlying controls.
const AnimatedInput = motion.create(Input);
const AnimatedLink = motion.create(Link);

const buttonBackgrounds = {
    default: ["var(--primary)", "var(--primary)"],
    outline: ["var(--background)", "var(--accent)"],
    secondary: ["var(--secondary)", "var(--accent)"],
    ghost: ["rgba(0, 0, 0, 0)", "var(--accent)"],
    destructive: ["var(--destructive)", "var(--destructive)"],
    link: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0)"],
};

const arrowOffsets = {
    right: { x: 2, y: 0 },
    down: { x: 0, y: 2 },
    "up-right": { x: 2, y: -2 },
};

type ControlStyleProps = VariantProps<typeof buttonVariants> & {
    restBackground?: string;
    hoverBackground?: string;
};

function useButtonMotion({
    variant = "default",
    restBackground,
    hoverBackground,
    disabled = false,
}: ControlStyleProps & { disabled?: boolean }) {
    const reducedMotion = useLandingReducedMotion();
    const [rest, hover] = buttonBackgrounds[variant ?? "default"];

    return {
        initial: false as const,
        animate: "rest",
        whileHover: disabled ? undefined : "hover",
        whileFocus: "hover",
        whileTap: reducedMotion || disabled ? undefined : { y: 1 },
        variants: {
            rest: {
                backgroundColor: restBackground ?? rest,
                opacity: disabled ? 0.5 : 1,
            },
            hover: {
                backgroundColor: hoverBackground ?? hover,
                opacity: variant === "default" ? 0.9 : 1,
            },
        },
        transition: { duration: reducedMotion ? 0 : 0.16, ease: "easeOut" as const },
    };
}

export function MotionButton({
    className,
    variant = "default",
    size = "default",
    restBackground,
    hoverBackground,
    ...props
}: ComponentProps<typeof motion.button> & ControlStyleProps) {
    const animation = useButtonMotion({
        variant,
        restBackground,
        hoverBackground,
        disabled: props.disabled,
    });

    return (
        <motion.button
            type="button"
            {...props}
            {...animation}
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(
                buttonVariants({ variant, size }),
                "transition-none active:not-aria-[haspopup]:translate-y-0",
                className,
            )}
        />
    );
}

export function MotionButtonLink({
    href,
    className,
    variant = "default",
    size = "default",
    restBackground,
    hoverBackground,
    ...props
}: Omit<ComponentProps<typeof motion.a>, "href"> &
    ControlStyleProps & { href: string }) {
    const animation = useButtonMotion({
        variant,
        restBackground,
        hoverBackground,
    });
    const Component = href.startsWith("#") ? motion.a : AnimatedLink;

    return (
        <Component
            {...props}
            {...animation}
            href={href}
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(
                buttonVariants({ variant, size }),
                "transition-none active:not-aria-[haspopup]:translate-y-0",
                className,
            )}
        />
    );
}

export function MotionLink(props: ComponentProps<typeof AnimatedLink>) {
    const reducedMotion = useLandingReducedMotion();

    return (
        <AnimatedLink
            {...props}
            initial={false}
            animate="rest"
            whileHover="hover"
            whileFocus="hover"
            variants={{ rest: {}, hover: {} }}
            transition={{ duration: reducedMotion ? 0 : 0.16, ease: "easeOut" }}
        />
    );
}

export function MotionArrow({
    children,
    direction = "right",
}: {
    children: ReactNode;
    direction?: "right" | "down" | "up-right";
}) {
    const reducedMotion = useLandingReducedMotion();

    return (
        <motion.span
            className="inline-flex shrink-0"
            aria-hidden="true"
            variants={{
                rest: { x: 0, y: 0 },
                hover: reducedMotion ? { x: 0, y: 0 } : arrowOffsets[direction],
            }}
            transition={{ duration: reducedMotion ? 0 : 0.16, ease: "easeOut" }}
        >
            {children}
        </motion.span>
    );
}

export function MotionInput({
    className,
    ...props
}: ComponentProps<typeof AnimatedInput>) {
    const reducedMotion = useLandingReducedMotion();

    return (
        <AnimatedInput
            {...props}
            className={cn("transition-none", className)}
            initial={false}
            animate={{ borderColor: "var(--sidebar-border)" }}
            whileFocus={{ borderColor: "var(--ring)" }}
            transition={{ duration: reducedMotion ? 0 : 0.16, ease: "easeOut" }}
        />
    );
}

export function SkipToContent() {
    const reducedMotion = useLandingReducedMotion();

    return (
        <motion.a
            href="#main-content"
            className="fixed top-3 left-3 z-50 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
            initial={false}
            animate={{ y: -96 }}
            whileFocus={{ y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.16, ease: "easeOut" }}
        >
            Skip to content
        </motion.a>
    );
}
