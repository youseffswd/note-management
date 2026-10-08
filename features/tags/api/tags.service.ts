import { createServerSupabase, getUser } from "@/shared/lib/supabase/server";
import { Tag } from "../types";
import { ResponseError } from "@/shared/lib/errors";


export const getAllTags = async (): Promise<Tag[]> => {
    const supabase = await createServerSupabase();
    const userId = (await getUser())?.id;
    if (!userId) throw new ResponseError("Unauthorized", 401);
    const res = await supabase
        .from("tags")
        .select("id, name, color")
        .eq("userId", userId);
    if (res.error)
        throw new ResponseError(res.error.message, 500, res.error.code);
    return res.data as Tag[];
};

export const addTag = async (tag: Tag): Promise<void> => {
    const supabase = await createServerSupabase();
    const userId = (await getUser())?.id;
    if (!userId) throw new ResponseError("Unauthorized", 401);
    const res = await supabase.from("tags").insert({
        id: tag.id,
        name: tag.name,
        color: tag.color,
        userId,
    });
    if (res.error)
        throw new ResponseError(res.error.message, 500, res.error.code);
};

export const removeTag = async (tagId: string): Promise<void> => {
    const supabase = await createServerSupabase();
    const userId = (await getUser())?.id;
    if (!userId) throw new ResponseError("Unauthorized", 401);
    const res = await supabase
        .from("tags")
        .delete()
        .eq("id", tagId)
        .eq("userId", userId);
    if (res.error)
        throw new ResponseError(res.error.message, 500, res.error.code);
};

export const addTagToNote = async (tagId: string, noteId: string) => {
    const supabase = await createServerSupabase();
    const userId = (await getUser())?.id;
    if (!userId) throw new ResponseError("Unauthorized", 401);
    const res = await supabase.from("note_tags").insert({
        tagId: tagId,
        noteId: noteId,
        userId
    });
    if (res.error)
        throw new ResponseError(res.error.message, 500, res.error.code);
};
export const removeTagFromNote = async (tagId: string, noteId: string) => {
    const supabase = await createServerSupabase();
    const userId = (await getUser())?.id;
    if (!userId) throw new ResponseError("Unauthorized", 401);
    const res = await supabase
        .from("note_tags")
        .delete()
        .eq("tagId", tagId)
        .eq("noteId", noteId);
    if (res.error)
        throw new ResponseError(res.error.message, 500, res.error.code);
};
