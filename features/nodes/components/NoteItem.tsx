"use client";

import { Button } from "@/shared/components/ui/button";
import { Note } from "../types";
import { FileIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface NoteItemProps {
    note: Note;
}

export default function NoteItem({ note }: NoteItemProps) {
    const router = useRouter();
    return (
        <Button
            variant="link"
            onClick={() => router.push(`/dashboard/notes/${note.id}`)}
            size="sm"
            className="w-full items-center justify-start gap-2 text-sidebar-foreground transition hover:bg-accent! hover:text-accent-foreground hover:no-underline"
        >
            <FileIcon className="text-amber-500 mb-px" />
            <span>{note.title}</span>
        </Button>
    );
}
