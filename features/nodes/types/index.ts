import type { PartialBlock } from "@blocknote/core";

type ParentId = string | null;

export interface Note {
    id: string;
    title: string;
    content: PartialBlock[];
    parentId: ParentId;
    createdAt: Date;
    updatedAt?: Date;
    type: "note";
    tagIds: string[];
}

export interface Folder {
    id: string;
    name: string;
    parentId: ParentId;
    children: (Folder | Note)[];
    createdAt: Date;
    updatedAt?: Date;
    type: "folder";
    colorClass: string;
}

export type Node = Note | Folder;
