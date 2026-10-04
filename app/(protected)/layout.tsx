import { NodeStoreInitializer } from "@/features/nodes";
import { getFolders, getNotes } from "@/features/nodes/server";
import NoteFeaturesInitializer from "@/shared/components/layout/NoteFeaturesInitializer";

export default async function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [folders, notes] = await Promise.all([getFolders(), getNotes()]);

    // Keep the stores mounted across dashboard and workspace navigation.
    return (
        <>
            <NodeStoreInitializer folders={folders} notes={notes} />
            <NoteFeaturesInitializer />
            {children}
        </>
    );
}
