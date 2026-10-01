"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { FolderIcon } from "lucide-react";

import { formatRelativeTime } from "@/shared/lib/relative-time";
import { useNodeStore } from "../store/nodes.store";
import type { Note } from "../types";
import { notePreview } from "../utils/note-preview";

interface NoteCardProps {
    note: Note;
    actions?: ReactNode;
    metadata?: ReactNode;
}

export default function NoteCard({ note, actions, metadata }: NoteCardProps) {
    const folderName = useNodeStore(state => {
        const parent = note.parentId ? state.nodesHash[note.parentId] : undefined;
        return parent?.type === "folder" ? parent.name : null;
    });
    const preview = useMemo(() => notePreview(note.content), [note.content]);

    return (
        <article className="relative rounded-lg border border-border bg-card px-4 py-3.5 transition-colors hover:border-muted-foreground/30 hover:bg-secondary has-focus-visible:border-ring">
            <div className="mb-1.5 flex items-start justify-between gap-2.5">
                <h3 className="text-sm font-semibold text-foreground">
                    {/* Stretched over the whole card, so the card is the link. */}
                    <Link
                        href={`/dashboard/notes/${note.id}`}
                        className="outline-none after:absolute after:inset-0 after:rounded-lg"
                    >
                        {note.title}
                    </Link>
                </h3>
                {actions && (
                    <div className="relative z-10 -mr-1 -mt-0.5 shrink-0">
                        {actions}
                    </div>
                )}
            </div>
            <p className="mb-2.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                {preview || <span className="italic opacity-70">Empty note</span>}
            </p>
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-muted-foreground">
                {metadata}
                {folderName && (
                    <span className="flex min-w-0 items-center gap-1">
                        <FolderIcon className="size-2.5 shrink-0" />
                        <span className="truncate">{folderName}</span>
                    </span>
                )}
                <span className="ml-auto shrink-0">
                    {formatRelativeTime(note.updatedAt ?? note.createdAt)}
                </span>
            </div>

            tsdklfasdnklfaklsdf;knasdfnasdfkl;asd;nklfkasndfk;nlasdknfaskndfas;ldf;kasfasn;df
        </article>
    );
}
