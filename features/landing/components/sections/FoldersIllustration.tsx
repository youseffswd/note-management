import { ChevronDown, Folder, Hash } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

export default function FoldersIllustration() {
    return (
        <div className="mt-auto pt-7" aria-hidden="true">
            <div className="mb-4 rotate-1 rounded-lg border border-sidebar-border bg-sidebar p-4 text-xs text-sidebar-foreground">
                <div className="mb-2 flex items-center justify-between gap-2 border-b border-sidebar-border pb-3 text-foreground">
                    <span className="flex items-center gap-2">
                        <Folder size={16} className="text-primary" />
                        My little universe
                    </span>
                    <ChevronDown size={13} />
                </div>
                <div className="flex items-center gap-2 py-2">
                    <Folder size={16} className="text-primary" />
                    <span>Things I’m making</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                        08
                    </span>
                </div>
                <div className="flex items-center gap-2 py-2">
                    <Folder size={16} className="text-chart-3" />
                    <span>Life, lately</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                        12
                    </span>
                </div>
                <div className="flex items-center gap-2 py-2">
                    <Folder size={16} className="text-chart-5" />
                    <span>Always learning</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                        05
                    </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge
                        variant="secondary"
                        className="rounded-md bg-chart-2/10 text-[10px] text-chart-2"
                    >
                        <Hash size={10} />
                        ideas
                    </Badge>
                    <Badge
                        variant="secondary"
                        className="rounded-md bg-chart-3/10 text-[10px] text-chart-3"
                    >
                        <Hash size={10} />
                        personal
                    </Badge>
                    <Badge
                        variant="secondary"
                        className="rounded-md bg-chart-5/10 text-[10px] text-chart-5"
                    >
                        <Hash size={10} />
                        someday
                    </Badge>
                </div>
            </div>
        </div>
    );
}
