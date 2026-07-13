"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { Note } from "@/shared/types";

// The dynamic import with ssr: false happens here inside the Client Component
const Editor = dynamic(() => import("./Editor"), { 
    ssr: false,
    loading: () => (
        <div className="flex-1 flex items-center justify-center w-full h-full min-h-125">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
    )
});

export default function EditorWrapper({ className, note }: { className?: string; note: Note }) {
    return <Editor className={className || ""} note={note} />;
}
