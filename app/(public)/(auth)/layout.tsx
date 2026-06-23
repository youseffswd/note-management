import { Logo } from "@/shared/components/Logo";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section
            className="min-h-screen flex justify-center items-center flex-col gap-8"
            style={{
                backgroundImage: `radial-gradient(ellipse 80% 60% at 20% 40%, rgba(79,142,247,0.07) 0%, transparent 60%),
                                    radial-gradient(ellipse 50% 50% at 80% 70%, rgba(157,124,244,0.05) 0%, transparent 50%)`,
            }}
        >
            <Logo size="lg" />
            {children}
        </section>
    );
}
