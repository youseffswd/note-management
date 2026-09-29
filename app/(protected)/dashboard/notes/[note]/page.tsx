import { NoteMetadata, Editor } from "@/features/nodes";
import { getNote } from "@/features/nodes/server";
import { getUser } from "@/shared/lib/supabase/server";
import { Loader } from "@/shared/components/ui/loader";
import type { Note } from "@/features/nodes";
import { Suspense } from "react";

async function NoteDataFetcher({ noteId }: { noteId: string }) {
    // The user id keys this device's local drafts. It comes from the server so
    // the editor has it on its first render — the client auth store is still
    // null at that point, which is exactly when the draft must be read.
    const [note, user] = await Promise.all([
        getNote(noteId) as unknown as Promise<Note>,
        getUser(),
    ]);

    if (!user) return null;

    return (
        <>
            <NoteMetadata createdAt={note.createdAt} updatedAt={note.updatedAt} />
            <Editor className="flex-1 mt-2" note={note} userId={user.id} />
        </>
    );
}

export default async function NotePage({ params }: { params: Promise<{ note: string }> }) {
    const { note: noteId } = await params;

    return (
        <main className="flex flex-1 flex-col relative w-full h-full max-w-4xl mx-auto">
            <Suspense fallback={<div className="flex items-center justify-center h-full min-h-125"><Loader /></div>}>
                <NoteDataFetcher noteId={noteId} />
            </Suspense>
        </main>
    );
}
