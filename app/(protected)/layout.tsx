import { NodeStoreInitializer } from "@/features/nodes";
import { getFolders, getNotes } from "@/features/nodes/server";
import { TagsStoreInitializer } from "@/features/tags";
import { getAllTags } from "@/features/tags/server";
import NoteFeaturesInitializer from "@/shared/components/layout/NoteFeaturesInitializer";

export default async function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [folders, notes, tags] = await Promise.all([getFolders(), getNotes(), getAllTags()]);

    // Keep the stores mounted across dashboard and workspace navigation.
    return (
        <>
            <NodeStoreInitializer folders={folders} notes={notes} />
            <TagsStoreInitializer tags={tags} />
            <NoteFeaturesInitializer />
            {children}
        </>
    );
}
