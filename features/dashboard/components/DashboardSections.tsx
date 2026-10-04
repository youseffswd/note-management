import Link from "next/link";
import { ArrowUpRightIcon, FileTextIcon, Settings2Icon, StarIcon, TagIcon } from "lucide-react";

import { Skeleton } from "@/shared/components/ui/skeleton";

interface DashboardSectionsProps {
    initialized: boolean;
    noteCount: number;
    starredCount: number;
    tagCount: number;
}

export default function DashboardSections({ initialized, noteCount, starredCount, tagCount }: DashboardSectionsProps) {
    const sections = [
        {
            href: "/dashboard/notes",
            label: "Notes",
            description: "Every thought, in one place.",
            count: noteCount,
            unit: noteCount === 1 ? "note" : "notes",
            icon: FileTextIcon,
            color: "text-primary bg-primary/10 ring-primary/15",
            hover: "hover:border-primary/40 hover:shadow-primary/5",
        },
        {
            href: "/dashboard/starred",
            label: "Starred",
            description: "The ones you come back to.",
            count: starredCount,
            unit: starredCount === 1 ? "starred note" : "starred notes",
            icon: StarIcon,
            color: "text-chart-3 bg-chart-3/10 ring-chart-3/15",
            hover: "hover:border-chart-3/40 hover:shadow-chart-3/5",
        },
        {
            href: "/dashboard/tags",
            label: "Tags",
            description: "Connect the dots by topic.",
            count: tagCount,
            unit: tagCount === 1 ? "tag" : "tags",
            icon: TagIcon,
            color: "text-chart-5 bg-chart-5/10 ring-chart-5/15",
            hover: "hover:border-chart-5/40 hover:shadow-chart-5/5",
        },
        {
            href: "/dashboard/settings",
            label: "Settings",
            description: "A workspace that feels like you.",
            count: null,
            unit: "Manage account",
            icon: Settings2Icon,
            color: "text-chart-2 bg-chart-2/10 ring-chart-2/15",
            hover: "hover:border-chart-2/40 hover:shadow-chart-2/5",
        },
    ];

    return (
        <section aria-labelledby="workspace-heading">
            <div className="mb-5 flex items-center gap-3">
                <h2 id="workspace-heading" className="text-sm font-medium text-foreground">Explore your workspace</h2>
                <div className="h-px flex-1 bg-border/70" aria-hidden="true" />
                <span className="hidden text-xs text-muted-foreground sm:block">Everything in its place</span>
            </div>
            <nav aria-label="Workspace sections" className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
                {sections.map(section => (
                    <Link
                        key={section.href}
                        href={section.href}
                        className={`group flex min-w-0 flex-col rounded-2xl border border-border bg-card/70 p-4 transition-[border-color,background-color,box-shadow,transform] duration-200 hover:bg-card hover:shadow-xl motion-safe:hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:p-6 ${section.hover}`}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <span className={`flex size-10 items-center justify-center rounded-xl ring-1 ${section.color}`}>
                                <section.icon aria-hidden="true" className="size-5" strokeWidth={1.7} />
                            </span>
                            <ArrowUpRightIcon aria-hidden="true" className="size-4 text-muted-foreground/60 transition-colors group-hover:text-foreground" />
                        </div>
                        <h3 className="text-base font-semibold tracking-tight">{section.label}</h3>
                        <p className="mt-1.5 grow text-xs leading-relaxed text-muted-foreground sm:text-sm">{section.description}</p>
                        <div className="mt-6 flex min-h-8 items-baseline gap-2">
                            {section.count === null ? (
                                <span className="text-xs font-medium text-chart-2">{section.unit} <span aria-hidden="true">↗</span></span>
                            ) : initialized ? (
                                <span className="text-xs text-muted-foreground">
                                    <span className="mr-2 text-2xl font-medium tracking-tight text-foreground tabular-nums sm:text-3xl">{section.count}</span>
                                    {" "}{section.unit}
                                </span>
                            ) : (
                                <span role="status" aria-label={`Loading ${section.label.toLowerCase()} count`}>
                                    <Skeleton className="h-8 w-20" />
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </nav>
        </section>
    );
}
