import { NextResponse } from "next/server";
import { getNotes, addNote } from "@/features/nodes/server";
import { ResponseError } from "@/shared/lib/errors";

export async function GET() {
    try {
        const notes = await getNotes();
        return NextResponse.json(notes);
    } catch (error: unknown) {
        if (error instanceof ResponseError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status },
            );
        }
        return NextResponse.json(
            { error: "Failed to fetch notes" },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await addNote(body);
        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof ResponseError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status },
            );
        }
        return NextResponse.json(
            { error: "Failed to create note" },
            { status: 500 },
        );
    }
}
