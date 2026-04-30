


export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="">
            {children}
        </main>
    );
}