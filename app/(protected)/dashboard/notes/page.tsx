import { Logo } from "@/shared/components/Logo";

export default function NotesPage() {

    return (
        <div className="flex-1 flex flex-col items-center justify-center w-full h-full min-h-125 text-center px-4">
            <div className="flex flex-col items-center  duration-500 ease-out">
                <Logo size="xl" showText={false} className="mb-6 opacity-80" />
                <h2 className="text-xl font-semibold text-foreground mb-2 tracking-tight">
                    No note is selected
                </h2>
                <p className="text-sm text-muted-foreground/80 max-w-sm">
                    Select a note from the sidebar or create a new one to start writing.
                </p>
            </div>
        </div>
    );
}
