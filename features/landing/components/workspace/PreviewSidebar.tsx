import { useLandingReducedMotion } from "../../hooks/use-landing-reduced-motion";
import { useId } from "react";
import { LayoutGroup, motion } from "framer-motion";
import {
    ChevronDown,
    ChevronRight,
    FileText,
    Folder,
    Search,
    Sparkles,
    Star,
    X,
} from "lucide-react";
import { Logo } from "@/shared/components/Logo";
import { MotionButton, MotionInput } from "../motion/MotionControls";
import type { PreviewNote } from "../../data/preview-notes";

interface PreviewSidebarProps {
    visibleNotes: PreviewNote[];
    activeId: string;
    query: string;
    starredOnly: boolean;
    starredCount: number;
    totalNotes: number;
    onQueryChange: (query: string) => void;
    onFilterChange: (starredOnly: boolean) => void;
    onSelectNote: (id: string) => void;
}

export default function PreviewSidebar({
    visibleNotes,
    activeId,
    query,
    starredOnly,
    starredCount,
    totalNotes,
    onQueryChange,
    onFilterChange,
    onSelectNote,
}: PreviewSidebarProps) {
    const selectionId = useId();
    const reducedMotion = useLandingReducedMotion();

    return (
        <aside
            className="flex flex-col border-b border-sidebar-border bg-sidebar p-3 text-sidebar-foreground md:border-r md:border-b-0 md:p-4"
            aria-label="Sample notes"
        >
            <div className="mb-6 hidden items-center justify-between md:flex">
                <Logo size="xs" />
                <ChevronDown size={14} aria-hidden="true" />
            </div>
            <div className="relative mb-3">
                <Search
                    size={15}
                    className="pointer-events-none absolute top-3.5 left-3 text-muted-foreground"
                    aria-hidden="true"
                />
                <MotionInput
                    aria-label="Search sample notes"
                    placeholder="Search notes…"
                    type="search"
                    className="h-11 border-sidebar-border bg-sidebar-accent/50 pr-10 pl-9 text-sm [&::-webkit-search-cancel-button]:appearance-none"
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                />
                {query && (
                    <MotionButton
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1.5 right-1.5 size-8"
                        aria-label="Clear search"
                        onClick={() => onQueryChange("")}
                    >
                        <X size={14} />
                    </MotionButton>
                )}
            </div>
            <div className="mb-3 flex gap-1 md:mb-6 md:flex-col">
                <MotionButton
                    type="button"
                    variant="ghost"
                    className="h-10 justify-start gap-2.5 text-xs aria-pressed:text-primary"
                    restBackground={!starredOnly ? "var(--accent)" : undefined}
                    hoverBackground="var(--sidebar-accent)"
                    aria-pressed={!starredOnly}
                    onClick={() => onFilterChange(false)}
                >
                    <FileText size={15} aria-hidden="true" />
                    All notes
                    <span className="ml-auto pl-3 text-muted-foreground">
                        {totalNotes}
                    </span>
                </MotionButton>
                <MotionButton
                    type="button"
                    variant="ghost"
                    className="h-10 justify-start gap-2.5 text-xs aria-pressed:text-primary"
                    restBackground={starredOnly ? "var(--accent)" : undefined}
                    hoverBackground="var(--sidebar-accent)"
                    aria-pressed={starredOnly}
                    onClick={() => onFilterChange(true)}
                >
                    <Star size={15} aria-hidden="true" />
                    Starred
                    <span className="ml-auto pl-3 text-muted-foreground">
                        {starredCount}
                    </span>
                </MotionButton>
            </div>
            <p className="mb-3 hidden px-2 text-[10px] font-medium tracking-widest text-muted-foreground md:block">
                YOUR LITTLE CORNER
            </p>
            <div className="flex flex-wrap gap-1.5 md:flex-col">
                <LayoutGroup id={selectionId}>
                    {visibleNotes.map((note) => (
                        <MotionButton
                            type="button"
                            key={note.id}
                            variant="ghost"
                            className="relative isolate h-auto min-h-10 flex-1 justify-start gap-2 border-sidebar-border px-2 text-[11px] whitespace-normal aria-pressed:text-sidebar-accent-foreground md:flex-none md:border-transparent md:text-xs"
                            hoverBackground="var(--sidebar-accent)"
                            aria-pressed={activeId === note.id}
                            onClick={() => onSelectNote(note.id)}
                        >
                            {activeId === note.id && (
                                <motion.span
                                    layoutId="active-note"
                                    initial={false}
                                    className="pointer-events-none absolute inset-0 -z-10 rounded-lg bg-sidebar-accent"
                                    transition={
                                        reducedMotion
                                            ? { duration: 0 }
                                            : {
                                                  type: "spring",
                                                  stiffness: 420,
                                                  damping: 36,
                                              }
                                    }
                                    aria-hidden="true"
                                />
                            )}
                            <Folder
                                size={15}
                                className="text-primary"
                                aria-hidden="true"
                            />
                            <span className="text-left">{note.title}</span>
                            <ChevronRight
                                size={13}
                                className="ml-auto hidden md:block"
                                aria-hidden="true"
                            />
                        </MotionButton>
                    ))}
                </LayoutGroup>
                {visibleNotes.length === 0 && (
                    <p
                        className="p-2 text-xs leading-relaxed text-muted-foreground"
                        role="status"
                    >
                        No notes here yet. Try another search or view all notes.
                    </p>
                )}
            </div>
            <div className="mt-auto hidden items-center gap-2 border-t border-sidebar-border pt-4 text-xs md:flex">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 font-medium text-primary">
                    Y
                </span>
                <div>
                    Your space
                    <span className="mt-0.5 block text-[10px] text-muted-foreground">
                        A little more organized
                    </span>
                </div>
                <Sparkles
                    size={15}
                    className="ml-auto text-chart-5"
                    aria-hidden="true"
                />
            </div>
        </aside>
    );
}
