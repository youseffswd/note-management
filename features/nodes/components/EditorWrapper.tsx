"use client";

import dynamic from "next/dynamic";
import type { Note } from "../types";
import { Loader } from "@/shared/components/ui/loader";

// The dynamic import with ssr: false happens here inside the Client Component
const Editor = dynamic(() => import("./Editor"), { 
    ssr: false,
    loading: () => (
        <div className="flex-1 flex items-center justify-center w-full h-full min-h-125">
            <Loader />
        </div>
    )
});

export default function EditorWrapper({ className, note, userId }: { className?: string; note: Note; userId: string }) {
    return <Editor className={className || ""} note={note} userId={userId} />;
}
