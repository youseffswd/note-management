import { Check, FileText, Search, Star } from "lucide-react";

export default function SearchIllustration() {
    return (
        <div className="mt-auto pt-7" aria-hidden="true">
            <div className="relative mb-6 -rotate-1">
                <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-background p-3 text-xs text-muted-foreground">
                    <Search size={16} className="text-primary" />
                    that brilliant idea
                    <span className="h-3 w-px bg-primary" />
                </div>
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background p-3">
                    <FileText size={19} className="shrink-0 text-primary" />
                    <p className="text-xs">
                        The next big thing
                        <span className="mt-1 block text-[10px] text-muted-foreground">
                            Projects / Ideas
                        </span>
                    </p>
                    <Star
                        size={14}
                        className="ml-auto shrink-0 text-chart-3"
                        fill="currentColor"
                    />
                </div>
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background p-3">
                    <FileText size={19} className="shrink-0 text-primary" />
                    <p className="text-xs">
                        A spark of inspiration
                        <span className="mt-1 block text-[10px] text-muted-foreground">
                            Personal / Someday
                        </span>
                    </p>
                </div>
                <span className="absolute -right-1 -bottom-3 flex rotate-6 items-center gap-1 rounded-md border border-border bg-secondary px-2.5 py-1 text-[10px] text-chart-2">
                    <Check size={13} />
                    There it is.
                </span>
            </div>
        </div>
    );
}
