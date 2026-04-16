interface Note {
    id: string;
    title: string;
    description: string;
    content: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt?: Date;
}

interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    children: (Folder | Note)[];
    createdAt: Date;
    updatedAt?: Date;
}