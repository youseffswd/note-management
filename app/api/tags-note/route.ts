import { addTagToNote, removeTagFromNote } from "@/features/tags/server";
import { ResponseError } from "@/shared/lib/errors";
import { NextResponse } from "next/server";

function errorResponse(error: unknown, fallback: string) {
    if (error instanceof ResponseError) {
        return NextResponse.json(
            { error: error.message },
            { status: error.status },
        );
    }
    return NextResponse.json({ error: fallback }, { status: 500 });
}

function requireIds(tagId: unknown, noteId: unknown) {
    if (typeof tagId !== "string" || typeof noteId !== "string") {
        throw new ResponseError("tagId and noteId are required", 400);
    }
    return { tagId, noteId };
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { tagId, noteId } = requireIds(body?.tagId, body?.noteId);
        await addTagToNote(tagId, noteId);
        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error: unknown) {
        return errorResponse(error, "Failed to add tag to note");
    }
}

export async function DELETE(request: Request) {
    try {
        const params = new URL(request.url).searchParams;
        const { tagId, noteId } = requireIds(
            params.get("tagId"),
            params.get("noteId"),
        );
        await removeTagFromNote(tagId, noteId);
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        return errorResponse(error, "Failed to remove tag from note");
    }
}
