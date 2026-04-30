import { createServerSupabase, getUser } from "@/lib/supabase/server";
import { ResponseError } from "@/lib/errors";

export async function getNodes(): Promise<{
    folders: Folder[];
    notes: Note[];
}> {
    const supabase = await createServerSupabase();

    const [
        { data: notes, error: noteError },
        { data: folders, error: folderError },
    ] = await Promise.all([
        supabase.from("notes").select("*"),
        supabase.from("folders").select("*"),
    ]);
    if (noteError || folderError) {
        console.error("Error fetching data:", noteError, folderError);
        throw new ResponseError(
            noteError?.message ||
                folderError?.message ||
                "Failed to fetch notes and folders",
            500,
        );
    }
    const mappedNotes: Note[] = notes.map(note => ({
        ...note,
        parentId: note.folderId,
        folderId: undefined,
        type: "note",
    }));
    const mappedFolders: Folder[] = folders.map(folder => ({
        ...folder,
        children: [],
        type: "folder",
    }));
    return {
        folders: mappedFolders,
        notes: mappedNotes,
    };
}

export async function addNote(note: Omit<Note, "userId">): Promise<void> {
    const supabase = await createServerSupabase();
    const userId = (await getUser())?.id;

    const { error } = await supabase.from("notes").insert({
        id: note.id,
        title: note.title,
        content: note.content,
        folderId: note.parentId,
        description: note.description,
        userId,
    });
    if (error) {
        console.error("Error inserting note:", error);
        throw new ResponseError(error.message, 500);
    }
}
export async function addFolder(
    folder: Omit<Folder, "userId" | "children">,
): Promise<void> {
    const supabase = await createServerSupabase();
    const userId = (await getUser())?.id;

    const { error } = await supabase.from("folders").insert({
        id: folder.id,
        name: folder.name,
        parentId: folder.parentId,
        colorClass: folder.colorClass,
        userId,
    });
    if (error) {
        console.error("Error inserting folder:", error);
        throw new ResponseError(error.message, 500);
    }
}

export async function deleteNode(
    nodeId: string,
    nodeType: "note" | "folder",
): Promise<void> {
    const supabase = await createServerSupabase();
    let response;
    if (nodeType === "note") {
        response = await supabase.from("notes").delete().eq("id", nodeId);
    } else {
        response = await supabase.from("folders").delete().eq("id", nodeId);
    }
    if (response.error) {
        console.error("Error deleting node:", response.error);
        throw new ResponseError(response.error.message, 500);
    }
}

export async function updateNote(note: Note): Promise<void> {
    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from("notes")
        .update({
            title: note.title,
            content: note.content,
            folderId: note.parentId,
            description: note.description,
        })
        .eq("id", note.id);
    if (error) {
        console.error("Error updating note:", error);
        throw new ResponseError(error.message, 500);
    }
}

export async function updateFolder(folder: Folder): Promise<void> {
    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from("folders")
        .update({
            name: folder.name,
            parentId: folder.parentId,
            colorClass: folder.colorClass,
        })
        .eq("id", folder.id);
    if (error) {
        console.error("Error updating folder:", error);
        throw new ResponseError(error.message, 500);
    }
}
