"use client";

import { Button } from "@/shared/components/ui/button";
import type { Note } from "@/features/nodes";
import { FileIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import ExplorerContextMenu from "./ExplorerContextMenu";
import { useActiveNoteId, useNodeStore } from "@/features/nodes";

interface NoteItemProps {
    note: Note;
}

export default function NoteItem({ note }: NoteItemProps) {
    const removeNote = useNodeStore(state => state.removeNote);
    const activeNoteId = useActiveNoteId();
    const isActive = activeNoteId === note.id;
    const router = useRouter();
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Its folders are already open on this render, so it can be scrolled to.
    useEffect(() => {
        if (isActive) buttonRef.current?.scrollIntoView({ block: "nearest" });
    }, [isActive]);

    const handleRename = () => {};

    const handleDuplicate = () => {};

    const handleDelete = async () => {
        try {
            await removeNote(note.id);
            if (isActive) router.push("/dashboard/notes");

        } catch (error) {
            console.error("Error deleting folder:", error);
        }
    };

    return (
        <ExplorerContextMenu
            target="note"
            onRename={handleRename}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
        >
            <Button
                ref={buttonRef}
                variant="link"
                aria-current={isActive ? "page" : undefined}
                onClick={() => router.push(`/dashboard/notes/${note.id}`)}
                size="sm"
                className="w-full items-center justify-start gap-2 text-sidebar-foreground transition hover:bg-accent! hover:text-accent-foreground hover:no-underline data-[state=open]:bg-accent aria-[current=page]:bg-accent aria-[current=page]:font-medium aria-[current=page]:text-accent-foreground"
            >
                <FileIcon className="text-amber-500 mb-px" />
                <span>{note.title}</span>
            </Button>
        </ExplorerContextMenu>
    );
}
