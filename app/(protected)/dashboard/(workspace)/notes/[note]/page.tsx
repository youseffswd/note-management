import { NoteView } from "@/features/nodes";
import { NoteTags } from "@/features/tags";

export default async function NotePage({ params }: { params: Promise<{ note: string }> }) {
    const { note: noteId } = await params;

    return (
        <main className="flex flex-1 flex-col relative w-full h-full max-w-4xl mx-auto">
            <NoteView noteId={noteId}>
                <NoteTags noteId={noteId} />
            </NoteView>
        </main>
    );
}
