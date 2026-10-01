import { createServerSupabase, getUser } from "@/shared/lib/supabase/server";
import { ResponseError } from "@/shared/lib/errors";
import type { PartialBlock } from "@blocknote/core";
import type { Note, Folder } from "../types";

export async function getNotes(): Promise<Note[]> {
    const supabase = await createServerSupabase();
    const userId = (await getUser())?.id;
    if (!userId) throw new ResponseError("Unauthorized", 401);
    const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("userId", userId);
    if (error) {
        console.error("Error fetching notes:", error);
        throw new ResponseError(error.message, 500);
    }
    const mappedNotes: Note[] = data.map(note => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: note.updatedAt ? new Date(note.updatedAt) : undefined,
        content: JSON.parse(note.content) as PartialBlock[],
        parentId: note.folderId,
        folderId: undefined,
        userId: undefined,
        type: "note",
    }));
    return mappedNotes;
}

export async function getFolders(): Promise<Folder[]> {
    const supabase = await createServerSupabase();
    const userId = (await getUser())?.id;
    if (!userId) throw new ResponseError("Unauthorized", 401);
    const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("userId", userId);
    if (error) {
        console.error("Error fetching folders:", error);
        throw new ResponseError(error.message, 500);
    }
    const mappedFolders: Folder[] = data.map(folder => ({
        ...folder,
        createdAt: new Date(folder.createdAt),
        updatedAt: folder.updatedAt ? new Date(folder.updatedAt) : undefined,
        children: [],
        userId: undefined,
        type: "folder",
    }));
    return mappedFolders;
}

export async function addNote(note: Omit<Note, "userId">): Promise<void> {
    const supabase = await createServerSupabase();
    const userId = (await getUser())?.id;
    if (!userId) throw new ResponseError("Unauthorized", 401);
    const { error } = await supabase.from("notes").insert({
        id: note.id,
        title: note.title,
        content: note.content,
        folderId: note.parentId,
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
    if (!userId) throw new ResponseError("Unauthorized", 401);

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

export async function deleteNote(nodeId: string): Promise<void> {
    const supabase = await createServerSupabase();
    const userId = (await getUser())?.id;
    if (!userId) throw new ResponseError("Unauthorized", 401);
    const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", nodeId)
        .eq("userId", userId);
    if (error) {
        console.error("Error deleting note:", error);
        throw new ResponseError(error.message, 500);
    }
}

export async function deleteFolder(nodeId: string): Promise<void> {
    const supabase = await createServerSupabase();
    const userId = (await getUser())?.id;
    if (!userId) throw new ResponseError("Unauthorized", 401);
    const { error } = await supabase
        .from("folders")
        .delete()
        .eq("id", nodeId)
        .eq("userId", userId);
    if (error) {
        console.error("Error deleting folder:", error);
        throw new ResponseError(error.message, 500);
    }
}

export async function updateNote(note: Note): Promise<void> {
    const supabase = await createServerSupabase();
    const userId = (await getUser())?.id;
    if (!userId) throw new ResponseError("Unauthorized", 401);
    const { error } = await supabase
        .from("notes")
        .update({
            title: note.title,
            content: JSON.stringify(note.content),
            folderId: note.parentId,
            updatedAt: note.updatedAt,
        })
        .eq("id", note.id)
        .eq("userId", userId);
    if (error) {
        console.error("Error updating note:", error);
        throw new ResponseError(error.message, 500);
    }
}

export async function updateFolder(folder: Folder): Promise<void> {
    const supabase = await createServerSupabase();
    const userId = (await getUser())?.id;
    if (!userId) throw new ResponseError("Unauthorized", 401);

    const { error } = await supabase
        .from("folders")
        .update({
            name: folder.name,
            parentId: folder.parentId,
            colorClass: folder.colorClass,
        })
        .eq("id", folder.id)
        .eq("userId", userId);
    if (error) {
        console.error("Error updating folder:", error);
        throw new ResponseError(error.message, 500);
    }
}
