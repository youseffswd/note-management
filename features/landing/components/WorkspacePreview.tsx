"use client";

import { Sparkles } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { useWorkspacePreview } from "../hooks/use-workspace-preview";
import PreviewSidebar from "./workspace/PreviewSidebar";
import PreviewEditor from "./workspace/PreviewEditor";

export default function WorkspacePreview() {
    const preview = useWorkspacePreview();

    return (
        <div className="relative scroll-mt-28" id="preview">
            <div className="mb-4 flex items-center justify-center gap-2 text-xs text-muted-foreground sm:justify-end">
                <Sparkles
                    size={14}
                    className="text-chart-5"
                    aria-hidden="true"
                />
                A clear space. A clearer mind.
            </div>
            <div
                className="overflow-hidden rounded-xl border border-border bg-background shadow-2xl shadow-primary/5"
                role="region"
                aria-label="Interactive NoteFlow preview"
                aria-describedby="preview-caption"
            >
                <div className="flex h-11 items-center justify-between gap-3 border-b border-border bg-card px-3 text-[10px] text-muted-foreground sm:px-5 sm:text-xs">
                    <div className="flex gap-1.5" aria-hidden="true">
                        <span className="size-2 rounded-full bg-destructive/70" />
                        <span className="size-2 rounded-full bg-chart-3/70" />
                        <span className="size-2 rounded-full bg-chart-2/70" />
                    </div>
                    <span>Room for your thoughts</span>
                    <Badge
                        variant="outline"
                        className="rounded-sm text-[8px] tracking-wider sm:text-[10px]"
                    >
                        LIVE PREVIEW
                    </Badge>
                </div>
                <div className="grid md:min-h-130 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]">
                    <PreviewSidebar
                        visibleNotes={preview.visibleNotes}
                        activeId={preview.activeNote.id}
                        query={preview.query}
                        starredOnly={preview.starredOnly}
                        starredCount={preview.starredCount}
                        totalNotes={preview.totalNotes}
                        onQueryChange={preview.setQuery}
                        onFilterChange={preview.setStarredOnly}
                        onSelectNote={preview.selectNote}
                    />
                    <PreviewEditor
                        note={preview.activeNote}
                        isStarred={preview.isStarred}
                        checked={preview.checked}
                        onToggleStar={preview.toggleStar}
                        onToggleTask={preview.toggleTask}
                    />
                </div>
            </div>
            <p
                id="preview-caption"
                className="mx-auto mt-5 max-w-xl text-center text-xs leading-6 text-muted-foreground"
            >
                Go on, explore. Select a note, try a search, or tick something
                off.{" "}
                <span className="block sm:inline">
                    This demo resets when you leave.
                </span>
            </p>
        </div>
    );
}
