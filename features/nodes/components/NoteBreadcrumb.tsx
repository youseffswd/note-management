"use client";

import Link from "next/link";
import { Fragment, useMemo } from "react";
import { FolderIcon, HomeIcon } from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { useNodeStore } from "../store/nodes.store";
import { useActiveNoteId } from "../hooks/use-active-note-id";
import { folderColorClass } from "../utils/folder-colors";
import { getAncestorFolders } from "../utils/folder-path";

/** Deeper paths keep the first folder and the last two, eliding the middle. */
const MAX_VISIBLE_FOLDERS = 3;

/** Home / folders / note, for the note open in the current route. */
export default function NoteBreadcrumb() {
    const activeNoteId = useActiveNoteId();
    const nodesHash = useNodeStore(state => state.nodesHash);

    const note = activeNoteId ? nodesHash[activeNoteId] : undefined;
    const folders = useMemo(
        () => (activeNoteId ? getAncestorFolders(nodesHash, activeNoteId) : []),
        [nodesHash, activeNoteId],
    );

    if (note?.type !== "note") return null;

    const elided = folders.length > MAX_VISIBLE_FOLDERS;
    const hiddenFolders = elided ? folders.slice(1, -2) : [];
    const visibleFolders = elided
        ? [folders[0], null, ...folders.slice(-2)]
        : folders;

    return (
        <Breadcrumb className="min-w-0">
            <BreadcrumbList className="flex-nowrap">
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/dashboard/notes" title="Notes">
                            <HomeIcon className="size-4" />
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {visibleFolders.map(folder => (
                    <Fragment key={folder?.id ?? "ellipsis"}>
                        <BreadcrumbSeparator>/</BreadcrumbSeparator>
                        {folder ? (
                            <BreadcrumbItem className="min-w-0">
                                <FolderIcon
                                    className={`size-4 shrink-0 fill-current ${folderColorClass(folder.colorClass)}`}
                                />
                                <span className="truncate max-w-32">
                                    {folder.name}
                                </span>
                            </BreadcrumbItem>
                        ) : (
                            <BreadcrumbItem
                                title={hiddenFolders.map(f => f.name).join(" / ")}
                            >
                                <BreadcrumbEllipsis />
                            </BreadcrumbItem>
                        )}
                    </Fragment>
                ))}
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem className="min-w-0">
                    <BreadcrumbPage className="truncate font-medium">
                        {note.title}
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
