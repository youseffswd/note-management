"use client";

import { Button } from "@/shared/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { ChevronRightIcon, FolderIcon } from "lucide-react";
import NoteItem from "./NoteItem";
import { Folder } from "@/shared/types";

const folderColors: Record<string, string> = {
    "chart-1": "text-chart-1",
    "chart-2": "text-chart-2",
    "chart-3": "text-chart-3",
    "chart-4": "text-chart-4",
    "chart-5": "text-chart-5",
};

interface FolderItemProps {
    folder: Folder;
}

export default function FolderItem({ folder }: FolderItemProps) {
    return (
        <Collapsible>
            <CollapsibleTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="group w-full justify-start transition hover:bg-accent! hover:text-accent-foreground"
                >
                    <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
                    <FolderIcon
                        className={`${folderColors[folder.colorClass] || "text-foreground"} fill-current`}
                    />
                    {folder.name}
                    <span className="ml-auto text-xs">{folder.children.length}</span>
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 ml-5 style-lyra:ml-4">
                <div className="flex flex-col gap-1">
                    {folder.children.map(child =>
                        child.type === "folder" ? (
                            <FolderItem key={child.id} folder={child} />
                        ) : (
                            <NoteItem key={child.id} note={child} />
                        ),
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
