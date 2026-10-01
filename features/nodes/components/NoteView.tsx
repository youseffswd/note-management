"use client";

import type { ReactNode } from "react";
import { useAuthStore } from "@/features/auth";
import { Logo } from "@/shared/components/Logo";
import { Loader } from "@/shared/components/ui/loader";
import { useNodeStore } from "../store/nodes.store";
import Editor from "./EditorWrapper";
import NoteMetadata from "./NoteMetadata";

interface NoteViewProps {
    noteId: string;
    children?: ReactNode;
}

/** Renders a note straight from the store, which holds every note. */
export default function NoteView({ noteId, children }: NoteViewProps) {
    const initialized = useNodeStore(state => state.initialized);
    const node = useNodeStore(state => state.nodesHash[noteId]);
    const wasDeleted = useNodeStore(state => Boolean(state.deletedIds[noteId]));
    // The user id keys this device's local drafts, which the editor reads on
    // its first render, so it must not mount before the id is known.
    const userId = useAuthStore(state => state.user?.id);

    if (!initialized || !userId) {
        return (
            <div className="flex items-center justify-center h-full min-h-125">
                <Loader />
            </div>
        );
    }

    if (node?.type !== "note") {
        return (
            <div className="flex-1 flex flex-col items-center justify-center w-full h-full min-h-125 text-center px-4">
                <Logo size="xl" showText={false} className="mb-6 opacity-80" />
                <h2 className="text-xl font-semibold text-foreground mb-2 tracking-tight">
                    {wasDeleted ? "This note was deleted" : "Note not found"}
                </h2>
                <p className="text-sm text-muted-foreground/80 max-w-sm">
                    Select a note from the sidebar or create a new one to start writing.
                </p>
            </div>
        );
    }

    return (
        // The editor reads its content once, so a different note needs a fresh instance.
        <Editor
            key={node.id}
            className="flex-1 mt-2"
            note={node}
            userId={userId}
            meta={
                <>
                    <NoteMetadata createdAt={node.createdAt} updatedAt={node.updatedAt} />
                    {children}
                </>
            }
        />
    );
}
