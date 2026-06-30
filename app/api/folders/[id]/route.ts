import { NextResponse } from "next/server";
import { updateFolder, deleteFolder } from "@/features/nodes/server";
import { ResponseError } from "@/shared/lib/errors";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { id } = await params;
        await updateFolder({ ...body, id });
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (error instanceof ResponseError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }
        return NextResponse.json(
            { error: "Failed to update folder" },
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
        await deleteFolder(id);
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (error instanceof ResponseError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }
        return NextResponse.json(
            { error: "Failed to delete folder" },
            { status: 500 }
        );
    }
}
