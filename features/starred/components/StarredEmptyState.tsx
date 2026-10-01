import { StarIcon } from "lucide-react";

export default function StarredEmptyState() {
    return (
        <div className="flex h-full min-h-125 flex-col items-center justify-center px-4 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground">
                <StarIcon className="size-6" />
            </div>
            <h2 className="mb-1.5 text-base font-semibold text-secondary-foreground">
                No starred notes
            </h2>
            <p className="max-w-72 text-[13px] leading-relaxed text-muted-foreground">
                Star important notes with the star button at the top of a
                note.
            </p>
        </div>
    );
}
