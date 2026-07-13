
import { NoteMetadata, Editor } from "@/features/nodes";
import { getNote } from "@/features/nodes/server";
import { Note } from "@/shared/types";

export default async function NotePage({
    params,
}: {
    params: Promise<{ note: string }>;
}) {
    const { note: noteId } = await params;
    const note = (await getNote(noteId)) as unknown as Note;

    return (
        <main className="flex flex-1 flex-col relative w-full h-full max-w-4xl mx-auto">
            <NoteMetadata createdAt={note.createdAt} updatedAt={note.updatedAt} />
            <Editor className="flex-1 mt-2" note={note} />
        </main>
    );
}
