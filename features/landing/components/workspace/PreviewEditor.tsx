import { useLandingReducedMotion } from "../../hooks/use-landing-reduced-motion";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronRight, Folder, Star } from "lucide-react";
import { MotionArrow, MotionButton, MotionLink } from "../motion/MotionControls";
import type { PreviewNote } from "../../data/preview-notes";
import PreviewNoteContent from "./PreviewNoteContent";

interface PreviewEditorProps {
    note: PreviewNote;
    isStarred: boolean;
    checked: string[];
    onToggleStar: () => void;
    onToggleTask: (taskId: string) => void;
}

export default function PreviewEditor({
    note,
    isStarred,
    checked,
    onToggleStar,
    onToggleTask,
}: PreviewEditorProps) {
    const reducedMotion = useLandingReducedMotion();

    return (
        <div className="flex min-w-0 flex-col">
            <div className="flex min-h-13 items-center justify-between gap-2 border-b border-border px-4 sm:px-6">
                <span className="flex min-w-0 items-center gap-2 text-[11px] text-muted-foreground sm:text-xs">
                    <Folder size={14} className="shrink-0" aria-hidden="true" />
                    {note.folder}
                    <ChevronRight
                        size={12}
                        className="shrink-0"
                        aria-hidden="true"
                    />
                    <span className="truncate text-secondary-foreground">
                        {note.title}
                    </span>
                </span>
                <MotionButton
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={
                        isStarred ? "Unstar sample note" : "Star sample note"
                    }
                    aria-pressed={isStarred}
                    className="size-10 text-muted-foreground"
                    onClick={onToggleStar}
                >
                    <motion.span
                        initial={false}
                        animate={{
                            color: isStarred
                                ? "var(--chart-3)"
                                : "var(--muted-foreground)",
                            scale:
                                isStarred && !reducedMotion ? [1, 1.12, 1] : 1,
                        }}
                        transition={{ duration: reducedMotion ? 0 : 0.3 }}
                    >
                        <Star
                            size={17}
                            fill={isStarred ? "currentColor" : "none"}
                        />
                    </motion.span>
                </MotionButton>
            </div>
            <div className="grid flex-1 overflow-hidden">
                <motion.div
                    key={note.id}
                    initial={{ opacity: reducedMotion ? 1 : 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reducedMotion ? 0 : 0.14 }}
                >
                    <PreviewNoteContent
                        note={note}
                        checked={checked}
                        onToggleTask={onToggleTask}
                    />
                </motion.div>
            </div>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-[10px] text-muted-foreground sm:px-6 sm:text-xs">
                <span className="inline-flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-chart-2" />A
                    little space to try things out
                </span>
                <MotionLink
                    href="/sign-up"
                    className="group inline-flex min-h-6 items-center gap-1 text-primary hover:underline"
                >
                    Make it yours
                    <MotionArrow direction="up-right">
                        <ArrowUpRight size={13} />
                    </MotionArrow>
                </MotionLink>
            </div>
        </div>
    );
}
