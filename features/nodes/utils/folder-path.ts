import type { Folder, Node } from "../types";

/** The folders containing `nodeId`, outermost first. */
export function getAncestorFolders(
    nodesHash: Record<string, Node>,
    nodeId: string,
): Folder[] {
    const ancestors: Folder[] = [];
    // Guards against a parentId cycle, which would otherwise loop forever.
    const visited = new Set<string>([nodeId]);

    let parentId = nodesHash[nodeId]?.parentId;
    while (parentId && !visited.has(parentId)) {
        const parent = nodesHash[parentId];
        if (parent?.type !== "folder") break;
        visited.add(parentId);
        ancestors.unshift(parent);
        parentId = parent.parentId;
    }

    return ancestors;
}

export function isAncestorOf(
    nodesHash: Record<string, Node>,
    folderId: string,
    nodeId: string,
): boolean {
    return getAncestorFolders(nodesHash, nodeId).some(
        folder => folder.id === folderId,
    );
}
