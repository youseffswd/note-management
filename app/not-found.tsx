import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import { Logo } from "@/shared/components/Logo";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorative glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-destructive/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="absolute top-8 left-8">
                <Logo size="md" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                <div className="mb-10 relative flex justify-center items-center">
                    {/* Giant 404 text floating behind */}
                    <div className="absolute text-[15rem] font-black text-foreground/[0.03] select-none pointer-events-none -mt-4 tracking-tighter">
                        404
                    </div>
                    
                    {/* Floating icon box */}
                    <div className="relative flex flex-col items-center animate-bounce [animation-duration:3s]">
                        <div className="w-24 h-24 bg-secondary/50 backdrop-blur-md rounded-2xl border border-border flex items-center justify-center shadow-xl shadow-black/20 relative z-10">
                            <FileQuestion className="w-12 h-12 text-primary" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                    Page Not Found
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
                    Oops! The note or page you are looking for seems to have vanished into the digital void.
                </p>

                <div className="flex items-center gap-4">
                    <Link 
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-lg transition-colors shadow-sm shadow-primary/25"
                    >
                        <Home className="w-4.5 h-4.5" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
