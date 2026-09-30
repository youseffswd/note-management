"use client";

import { Button } from "@/shared/components/ui/button";
import { Note } from "../types";
import { FileIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ExplorerContextMenu from "./ExplorerContextMenu";
import { useNodeStore } from "../store/nodes.store";

interface NoteItemProps {
    note: Note;
}

export default function NoteItem({ note }: NoteItemProps) {
  const removeNote = useNodeStore(state => state.removeNote)
    const router = useRouter();

    const handleRename = () => {};

    const handleDuplicate = () => {};

    const handleDelete = async () => {
        try {
            await removeNote(note.id);
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
                variant="link"
                onClick={() => router.push(`/dashboard/notes/${note.id}`)}
                size="sm"
                className="w-full items-center justify-start gap-2 text-sidebar-foreground transition hover:bg-accent! hover:text-accent-foreground hover:no-underline data-[state=open]:bg-accent"
            >
                <FileIcon className="text-amber-500 mb-px" />
                <span>{note.title}</span>
            </Button>
        </ExplorerContextMenu>
    );
}
