import type { Block } from "@blocknote/core";

export interface Note {
    id: string;
    title: string;
    description: string;//
    content: Block[];
    parentId: string | null;//
    createdAt: Date;//
    updatedAt?: Date;
    userId: string;
    type: "note";
}

export interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    children: (Folder | Note)[];
    createdAt: Date;
    updatedAt?: Date;
    userId: string;
    type: "folder";
    colorClass: string;
}