import { useIsPresent } from "framer-motion";
import { Lightbulb, Tag } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import type { PreviewNote } from "../../data/preview-notes";
import PreviewChecklist from "./PreviewChecklist";

interface PreviewNoteContentProps {
    note: PreviewNote;
    checked: string[];
    onToggleTask: (taskId: string) => void;
}

export default function PreviewNoteContent({
    note,
    checked,
    onToggleTask,
}: PreviewNoteContentProps) {
    const isPresent = useIsPresent();

    return (
        <div
            inert={!isPresent}
            aria-hidden={!isPresent}
            className="mx-auto w-full max-w-2xl px-5 py-7 sm:px-9 sm:py-9 lg:px-12"
        >
            <span className="mb-3 block text-3xl" aria-hidden="true">
                {note.emoji}
            </span>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {note.title}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {note.subtitle}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
                <Badge
                    variant="secondary"
                    className="gap-1 rounded-md bg-chart-5/10 text-chart-5"
                >
                    <Tag size={11} aria-hidden="true" />
                    {note.tag}
                </Badge>
                <Badge
                    variant="secondary"
                    className="rounded-md bg-chart-2/10 text-chart-2"
                >
                    my space
                </Badge>
            </div>
            <div className="my-6 border-t border-border" />
            <h3 className="text-sm font-medium">{note.heading}</h3>
            <p className="mt-2 text-xs leading-7 text-secondary-foreground sm:text-sm">
                {note.body}
            </p>
            <PreviewChecklist
                noteId={note.id}
                tasks={note.tasks}
                checked={checked}
                onToggle={onToggleTask}
            />
            <div className="mt-5 flex items-start gap-2.5 rounded-r-lg border-l-2 border-primary bg-accent px-3 py-3.5">
                <Lightbulb
                    size={17}
                    className="mt-0.5 shrink-0 text-primary"
                    aria-hidden="true"
                />
                <p className="text-xs leading-relaxed text-secondary-foreground">
                    {note.callout}
                </p>
            </div>
        </div>
    );
}
