import { getFolders, getNotes } from "@/features/nodes/server";
import AppLayout from "@/shared/components/layout/AppLayout";

export default async function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [folders,notes] = await Promise.all([getFolders(),getNotes()])
    return <AppLayout folders={folders} notes={notes}>{children}</AppLayout>;
}
