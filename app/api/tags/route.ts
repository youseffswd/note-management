import { addTag, getAllTags } from "@/features/tags/server";
import { ResponseError } from "@/shared/lib/errors";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const tags = await getAllTags();
        return NextResponse.json(tags);
    } catch (error: unknown) {
        if (error instanceof ResponseError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status },
            );
        }
        return NextResponse.json(
            { error: "Failed to fetch tags" },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await addTag(body);
        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof ResponseError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status },
            );
        }
        return NextResponse.json(
            { error: "Failed to create tag" },
            { status: 500 },
        );
    }
}
