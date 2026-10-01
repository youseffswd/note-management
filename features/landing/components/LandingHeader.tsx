"use client";

import { useLandingReducedMotion } from "../hooks/use-landing-reduced-motion";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/shared/components/Logo";
import {
    MotionArrow,
    MotionButton,
    MotionButtonLink,
} from "./motion/MotionControls";

const links = [
    { href: "#features", label: "Why NoteFlow" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#your-space", label: "Made for you" },
];

export default function LandingHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const menuButton = useRef<HTMLButtonElement>(null);
    const reducedMotion = useLandingReducedMotion();

    return (
        <header
            className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm"
            onKeyDown={(event) => {
                if (event.key === "Escape" && isOpen) {
                    setIsOpen(false);
                    menuButton.current?.focus();
                }
            }}
        >
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-21 lg:px-10">
                <Link
                    href="/"
                    aria-label="NoteFlow home"
                    className="inline-flex shrink-0"
                >
                    <Logo size="sm" />
                </Link>
                <nav
                    className="hidden items-center gap-7 md:flex"
                    aria-label="Main navigation"
                >
                    {links.map((link) => (
                        <motion.a
                            key={link.href}
                            href={link.href}
                            className="relative py-2 text-sm text-muted-foreground"
                            initial={false}
                            animate="rest"
                            whileHover="hover"
                            whileFocus="hover"
                            variants={{
                                rest: { color: "var(--muted-foreground)" },
                                hover: { color: "var(--foreground)" },
                            }}
                            transition={{ duration: reducedMotion ? 0 : 0.16 }}
                        >
                            {link.label}
                            <motion.span
                                aria-hidden="true"
                                className="absolute inset-x-0 bottom-0 h-px origin-left bg-primary"
                                variants={{
                                    rest: { scaleX: 0 },
                                    hover: { scaleX: 1 },
                                }}
                                transition={{ duration: reducedMotion ? 0 : 0.16 }}
                            />
                        </motion.a>
                    ))}
                </nav>
                <div className="flex items-center gap-2 sm:gap-4">
                    <MotionButtonLink
                        href="/login"
                        variant="ghost"
                        className="hidden md:inline-flex"
                    >
                        Log in
                    </MotionButtonLink>
                    <MotionButtonLink
                        href="/sign-up"
                        className="group h-10 gap-2 px-3 text-xs sm:px-4 sm:text-sm"
                    >
                        Get started{" "}
                        <MotionArrow direction="up-right">
                            <ArrowUpRight size={15} />
                        </MotionArrow>
                    </MotionButtonLink>
                    <MotionButton
                        ref={menuButton}
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-11 md:hidden"
                        aria-expanded={isOpen}
                        aria-controls="landing-mobile-menu"
                        aria-label={
                            isOpen ? "Close navigation" : "Open navigation"
                        }
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={22} /> : <Menu size={22} />}
                    </MotionButton>
                </div>
            </div>
            <motion.div
                initial={false}
                animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: reducedMotion ? 0 : 0.22 }}
                aria-hidden={!isOpen}
                inert={!isOpen}
                className="absolute inset-x-0 top-full overflow-hidden bg-background shadow-lg md:hidden"
            >
                <nav
                    id="landing-mobile-menu"
                    aria-label="Mobile navigation"
                    className="flex flex-col border-t border-border px-5 py-3 text-sm"
                >
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="flex min-h-12 items-center justify-between gap-3 text-secondary-foreground hover:text-primary"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                            <ArrowUpRight size={16} aria-hidden="true" />
                        </a>
                    ))}
                    <Link
                        href="/login"
                        className="flex min-h-12 items-center text-secondary-foreground hover:text-primary"
                        onClick={() => setIsOpen(false)}
                    >
                        Log in
                    </Link>
                </nav>
            </motion.div>
        </header>
    );
}
