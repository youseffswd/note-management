import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import { Logo } from "@/shared/components/Logo";

export default function LandingFooter() {
    return (
        <footer className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
            <div className="flex flex-col justify-between gap-7 border-b border-border pb-8 sm:flex-row sm:items-center">
                <div>
                    <Link
                        href="/"
                        className="inline-flex"
                        aria-label="NoteFlow home"
                    >
                        <Logo size="sm" />
                    </Link>
                    <p className="mt-3 text-xs text-muted-foreground">
                        A little space for your big ideas.
                    </p>
                </div>
                <nav
                    aria-label="Footer navigation"
                    className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-secondary-foreground [&_a]:inline-flex [&_a]:min-h-8 [&_a]:items-center [&_a:hover]:text-primary"
                >
                    <a href="#features">Features</a>
                    <a href="#questions">FAQs</a>
                    <Link href="/login">Log in</Link>
                    <Link href="/sign-up" className="gap-1">
                        Get started
                        <ArrowUpRight size={13} aria-hidden="true" />
                    </Link>
                </nav>
            </div>
            <div className="flex flex-col justify-between gap-3 pt-6 text-[11px] text-muted-foreground sm:flex-row sm:items-center">
                <span>
                    © {new Date().getFullYear()} NoteFlow. Room for what
                    matters.
                </span>
                <div className="flex items-center gap-5">
                    <Link
                        href="/privacy"
                        className="py-2 hover:text-foreground"
                    >
                        Privacy
                    </Link>
                    <Link href="/terms" className="py-2 hover:text-foreground">
                        Terms
                    </Link>
                    <span className="hidden items-center gap-1.5 lg:inline-flex">
                        Made for a little more clarity
                        <Heart
                            size={12}
                            className="text-chart-5"
                            aria-hidden="true"
                        />
                    </span>
                </div>
            </div>
        </footer>
    );
}
