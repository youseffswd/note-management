"use client";

import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import useNoteStore from "@/store/note-management";
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import { useEffect } from "react";

const Sidebar = () => {
    const initilizeNoteStore = useNoteStore(state => state.initilizeNoteStore);
    const rootNodes = useNoteStore(state => state.nodes);
    useEffect(() => {
        initilizeNoteStore();
    }, [initilizeNoteStore]);
    console.log("Root Nodes in Sidebar:", rootNodes);

    const renderItem = (node: Folder | Note) => {
        if (node.type === "folder") {
            const folderColors: Record<string, string> = {
                "chart-1": "text-chart-1",
                "chart-2": "text-chart-2",
                "chart-3": "text-chart-3",
                "chart-4": "text-chart-4",
                "chart-5": "text-chart-5",
            };
            return (
                <Collapsible key={node.id}>
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"
                        >
                            <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
                            <FolderIcon
                                className={`${folderColors[node.colorClass] || "text-foreground"} fill-current`}
                            />
                            {node.name}
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1 ml-5 style-lyra:ml-4">
                        <div className="flex flex-col gap-1">
                            {node.children.map(child => renderItem(child))}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            );
        }
        return (
            <Button
                key={node.id}
                variant="link"
                size="sm"
                className="w-full justify-start gap-2 text-foreground"
            >
                <FileIcon />
                <span>{node.title}</span>
            </Button>
        );
    };

    return (
        <div className="w-64 h-screen bg-sidebar p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Sidebar</h2>
            <div className="flex flex-col gap-2">
                {rootNodes.map(node => renderItem(node))}
            </div>
        </div>
    );
};

export default Sidebar;
