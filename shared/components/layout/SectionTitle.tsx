"use client";

import { usePathname } from "next/navigation";
import { StarIcon, TagIcon, type LucideIcon } from "lucide-react";

interface Section {
    icon: LucideIcon;
    label: string;
    iconClassName: string;
}

const sections: Record<string, Section> = {
    "/dashboard/starred": {
        icon: StarIcon,
        label: "Starred Notes",
        iconClassName: "text-chart-3",
    },
    "/dashboard/tags": {
        icon: TagIcon,
        label: "Tags",
        iconClassName: "text-primary",
    },
};

/** The header title on section pages. Notes show their breadcrumb instead. */
export default function SectionTitle() {
    const section = sections[usePathname()];
    if (!section) return null;

    return (
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <section.icon className={`size-4 ${section.iconClassName}`} />
            {section.label}
        </div>
    );
}
