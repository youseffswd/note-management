import { Calendar, History } from "lucide-react";

interface NoteMetadataProps {
    createdAt: Date | string;
    updatedAt?: Date | string;
}

export default function NoteMetadata({
    createdAt,
    updatedAt,
}: NoteMetadataProps) {

    return (
        <div className="w-full px-12 pt-12 pb-2 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-6 text-[13px] font-medium">
                <div className="flex items-center gap-2 text-muted-foreground/70 hover:text-foreground/90 transition-colors duration-200 cursor-default bg-secondary/30 px-3 py-1.5 rounded-md border border-border/40 backdrop-blur-sm">
                    <Calendar className="w-4 h-4 text-primary/70" />
                    <span>
                        Created{" "}
                        {new Date(createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                </div>

                {updatedAt && (
                    <div className="flex items-center gap-2 text-muted-foreground/70 hover:text-foreground/90 transition-colors duration-200 cursor-default bg-secondary/30 px-3 py-1.5 rounded-md border border-border/40 backdrop-blur-sm">
                        <History className="w-4 h-4 text-primary/70" />
                        <span>
                            Edited{" "}
                            {new Date(updatedAt).toLocaleDateString(undefined, {
                                year:"numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
