import { createServerSupabase, getUser } from "@/shared/lib/supabase/server";
import { ResponseError } from "@/shared/lib/errors";
import type { Block } from "@blocknote/core";
import { Note, Folder } from "@/shared/types";

export async function getNotes(): Promise<Note[]>{
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("notes").select("*");
  if(error){
    console.error("Error fetching notes:", error);
    throw new ResponseError(error.message, 500);
  }
  const mappedNotes: Note[] = data.map(note => ({
    ...note,
    content: JSON.parse(note.content) as Block[],
    parentId: note.folderId,
    folderId: undefined,
    type: "note",
  }));
  return mappedNotes;
}
export async function getNote(noteId:string){
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("notes").select("*").eq("id", noteId);
  if(error){
    console.error("Error fetching note:", error);
    throw new ResponseError(error.message, 500);
  }
  const note: Note = {
    ...data[0],
    content: JSON.parse(data[0].content) as Block[],
    parentId: data[0].folderId,
    folderId: undefined,
    type: "note",
  };
  return note;
}


export async function getFolders(): Promise<Folder[]>{
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("folders").select("*");
  if(error){
    console.error("Error fetching folders:", error);
    throw new ResponseError(error.message, 500);
  }
  const mappedFolders: Folder[] = data.map(folder => ({
    ...folder,
    children: [],
    type: "folder",
  }));
  return mappedFolders;
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

export async function deleteNote(nodeId: string): Promise<void> {
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("notes").delete().eq("id", nodeId);
  if (error) {
    console.error("Error deleting note:", error);
    throw new ResponseError(error.message, 500);
  }
}

export async function deleteFolder(nodeId: string): Promise<void> {
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("folders").delete().eq("id", nodeId);
  if (error) {
    console.error("Error deleting folder:", error);
    throw new ResponseError(error.message, 500);
  }
}

export async function updateNote(note: Note): Promise<void> {
    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from("notes")
        .update({
            title: note.title,
            content: JSON.stringify(note.content),
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
