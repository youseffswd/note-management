import { NoteMetadata, Editor } from "@/features/nodes";
import { getNote } from "@/features/nodes/server";
import { Loader } from "@/shared/components/ui/loader";
import { Note } from "@/shared/types";
import { Suspense } from "react";

async function NoteDataFetcher({ noteId }: { noteId: string }) {
    const note = (await getNote(noteId)) as unknown as Note;
    return (
        <>
            <NoteMetadata
                createdAt={note.createdAt}
                updatedAt={note.updatedAt}
            />
            <Editor className="flex-1 mt-2" note={note} />
        </>
    );
}

export default async function NotePage({
    params,
}: {
    params: Promise<{ note: string }>;
}) {
    const { note: noteId } = await params;

    return (
        <main className="flex flex-1 flex-col relative w-full h-full max-w-4xl mx-auto">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-full min-h-125">
                        <Loader />
                    </div>
                }
            >
                <NoteDataFetcher noteId={noteId} />
            </Suspense>
        </main>
    );
}
