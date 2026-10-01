import { CheckCheck, Folder, Heart, PencilLine } from "lucide-react";
import { Reveal } from "../motion/LandingMotion";

export default function BenefitsSection() {
    return (
        <Reveal>
            <div
                className="mx-auto mt-10 grid max-w-5xl grid-cols-2 justify-items-center gap-x-3 gap-y-6 border-b border-border px-4 pb-10 text-xs text-muted-foreground sm:flex sm:justify-around sm:px-8 sm:text-sm"
                aria-label="NoteFlow at a glance"
            >
                <span className="flex items-center gap-2">
                    <PencilLine
                        size={18}
                        className="text-primary"
                        aria-hidden="true"
                    />
                    Room to think
                </span>
                <span className="flex items-center gap-2">
                    <Folder
                        size={18}
                        className="text-primary"
                        aria-hidden="true"
                    />
                    A place for everything
                </span>
                <span className="flex items-center gap-2">
                    <CheckCheck
                        size={18}
                        className="text-primary"
                        aria-hidden="true"
                    />
                    Saved as you go
                </span>
                <span className="flex items-center gap-2">
                    <Heart
                        size={18}
                        className="text-primary"
                        aria-hidden="true"
                    />
                    Simply yours
                </span>
            </div>
        </Reveal>
    );
}
