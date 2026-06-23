import { Sidebar } from "@/features/nodes";

export default async function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="min-h-full flex flex-col">
            <Sidebar />
            {children}
        </main>
    );
}
