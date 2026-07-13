import { Logo } from "@/shared/components/Logo";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background min-h-screen">
            <div className="relative flex items-center justify-center animate-in fade-in zoom-in duration-500">
                {/* Glowing blurred background behind logo */}
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse [animation-duration:2s]" />
                
                {/* Spinning border effect - using tailwind arbitrary values for the gradient spinner */}
                <div className="absolute -inset-6 bg-gradient-to-tr from-transparent via-primary/30 to-primary rounded-[2.5rem] animate-spin [animation-duration:3s]" />
                
                {/* Inner mask to cut out the spinner center */}
                <div className="absolute -inset-5  rounded-[2.25rem]" />
                
                {/* The Logo itself */}
                <div className="relative z-10 flex items-center justify-center">
                    <Logo size="xl" showText={false} />
                </div>
            </div>
            
            <div className="mt-12 flex flex-col items-center gap-2 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-150 fill-mode-both">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    NoteFlow
                </h3>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    Preparing your workspace
                    <span className="flex gap-0.5">
                        <span className="animate-bounce delay-75 [animation-duration:1s]">.</span>
                        <span className="animate-bounce delay-150 [animation-duration:1s]">.</span>
                        <span className="animate-bounce delay-300 [animation-duration:1s]">.</span>
                    </span>
                </p>
            </div>
        </div>
    );
}
