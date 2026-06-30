import { NextResponse } from "next/server";
import { updateNote, deleteNote } from "@/features/nodes/server";
import { ResponseError } from "@/shared/lib/errors";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { id } = await params;
        await updateNote({ ...body, id });
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (error instanceof ResponseError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }
        return NextResponse.json(
            { error: "Failed to update note" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteNote(id);
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (error instanceof ResponseError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }
        return NextResponse.json(
            { error: "Failed to delete note" },
            { status: 500 }
        );
    }
}
