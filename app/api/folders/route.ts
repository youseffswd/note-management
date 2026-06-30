import { NextResponse } from "next/server";
import { getFolders, addFolder } from "@/features/nodes/server";
import { ResponseError } from "@/shared/lib/errors";

export async function GET() {
    try {
        const folders = await getFolders();
        return NextResponse.json(folders);
    } catch (error: unknown) {
        if (error instanceof ResponseError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }
        return NextResponse.json(
            { error: "Failed to fetch folders" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await addFolder(body);
        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof ResponseError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }
        return NextResponse.json(
            { error: "Failed to create folder" },
            { status: 500 }
        );
    }
}
