"use client";

import { RotateCcw, TriangleAlert, X } from "lucide-react";

interface DraftBannerProps {
    /** Epoch ms the draft was written locally. */
    savedAt: number;
    onRestore: () => void;
    onDiscard: () => void;
}

/**
 * Shown only when a local draft forked from a different server version than
 * the one on screen — i.e. the note was also changed somewhere else. The
 * server copy is rendered in the editor and the user arbitrates.
 */
export default function DraftBanner({
    savedAt,
    onRestore,
    onDiscard,
}: DraftBannerProps) {
    return (
        <div className="mx-8 mb-2 flex flex-wrap items-center gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-400">
            <TriangleAlert className="w-4 h-4 shrink-0" />
            <span className="flex-1 min-w-50">
                You have unsaved changes from{" "}
                {new Date(savedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}
                , but this note was also edited elsewhere since.
            </span>
            <button
                type="button"
                onClick={onRestore}
                className="inline-flex items-center gap-1.5 rounded border border-amber-500/40 px-2 py-1 hover:bg-amber-500/20 transition-colors cursor-pointer"
            >
                <RotateCcw className="w-3.5 h-3.5" />
                Restore mine
            </button>
            <button
                type="button"
                onClick={onDiscard}
                className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
                <X className="w-3.5 h-3.5" />
                Discard
            </button>
        </div>
    );
}
