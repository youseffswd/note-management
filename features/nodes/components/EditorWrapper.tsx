"use client";

import dynamic from "next/dynamic";
import { Note } from "@/shared/types";
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

export default function EditorWrapper({ className, note }: { className?: string; note: Note }) {
    return <Editor className={className || ""} note={note} />;
}
