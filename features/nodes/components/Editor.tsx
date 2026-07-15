"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import type { Block } from "@blocknote/core";
import { useEffect, useState } from "react";
import { Loader2, Check, CloudOff } from "lucide-react";
import { Note } from "@/shared/types";
import { useDebounceCallback } from "usehooks-ts";
// const initialContent = [
//             {
//                 type: "heading",
//                 props: { level: 1 },
//                 content: "Untitled Note"
//             },
//             {
//                 type: "paragraph",
//                 content: ""
//             },
//             {
//                 type: "paragraph",
//                 content: ""
//             },
//             {
//                 type: "paragraph",
//                 content: ""
//             },
//             {
//                 type: "paragraph",
//                 content: ""
//             },
//             {
//                 type: "paragraph",
//                 content: ""
//             },
//             {
//                 type: "paragraph",
//                 content: ""
//             },
//             {
//                 type: "paragraph",
//                 content: ""
//             },
//             {
//                 type: "paragraph",
//                 content: ""
//             },
//         ]

interface EditorProps {
    className: string;
    note: Note;
}
export default function Editor({ className, note }: EditorProps) {
    const editor = useCreateBlockNote({
        initialContent: note.content,
    });

    const [document, setDocument] = useState<Block[]>(note.content);
    const [saveStatus, setSaveStatus] = useState<
        "idle" | "saving" | "saved" | "error"
    >("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const saveContent = useDebounceCallback(
        async (newContent: Block[]) => {
            try {
                setSaveStatus("saving");
                setErrorMessage(null);

                // Safely extract title from the first block
                let title = note.title || "Untitled Note";
                try {
                    if (newContent && newContent.length > 0) {
                        const firstBlock = newContent[0];
                        if (
                            Array.isArray(firstBlock.content) &&
                            "text" in firstBlock.content[0]
                        ) {
                            title = firstBlock.content[0].text;
                        }
                    }
                } catch (e) {
                    // Keep original title if extraction fails
                }

                const response = await fetch(`/api/notes/${note.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...note,
                        title,
                        content: newContent,
                        updatedAt: new Date(),
                    }),
                });

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(data.error || "Failed to save note");
                }

                setSaveStatus("saved");
                // Clear "saved" status after a short delay
                setTimeout(() => setSaveStatus("idle"), 2500);
            } catch (err) {
                setSaveStatus("error");

                if (typeof navigator !== "undefined" && !navigator.onLine) {
                    setErrorMessage("No internet connection.");
                } else if (
                    err instanceof TypeError &&
                    err.message.includes("fetch")
                ) {
                    setErrorMessage("Network error. Check connection.");
                } else {
                    setErrorMessage(
                        err instanceof Error
                            ? err.message
                            : "An error occurred",
                    );
                }
            }
        },
        800
    );

    useEffect(() => {
        if (JSON.stringify(note.content) !== JSON.stringify(document)) {
            saveContent(document);
        }
    }, [document, saveContent, note.content]);

    return (
        <div className="custom-editor-wrapper w-full relative">
            {/* Save Status Indicator */}
            <div className="absolute right-8 top-4 z-10 flex items-center gap-2 pointer-events-none transition-all">
                {saveStatus === "saving" && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/70 px-2.5 py-1.5 rounded-md border border-border/50 backdrop-blur-sm shadow-sm">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                    </div>
                )}
                {saveStatus === "saved" && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1.5 rounded-md border border-emerald-500/20 backdrop-blur-sm shadow-sm">
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved</span>
                    </div>
                )}
                {saveStatus === "error" && (
                    <div
                        className="flex items-center gap-1.5 text-xs font-medium text-destructive bg-destructive/10 px-2.5 py-1.5 rounded-md border border-destructive/20 backdrop-blur-sm shadow-sm pointer-events-auto whitespace-nowrap"
                        title={errorMessage || "Failed to save"}
                    >
                        <CloudOff className="w-3.5 h-3.5 shrink-0" />
                        <span>{errorMessage || "Error saving"}</span>
                    </div>
                )}
            </div>

            <BlockNoteView
                onChange={() => {
                    const doc = editor.document;
                    setDocument(doc);
                }}
                className={className}
                editor={editor}
            />
        </div>
    );
}
