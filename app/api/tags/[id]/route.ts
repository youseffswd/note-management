import { removeTag } from "@/features/tags/server";
import { ResponseError } from "@/shared/lib/errors";
import { NextResponse } from "next/server";



export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await removeTag(id);
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (error instanceof ResponseError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }
        return NextResponse.json(
            { error: "Failed to delete tag" },
            { status: 500 }
        );
    }
}
