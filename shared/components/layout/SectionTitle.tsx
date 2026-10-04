"use client";

import { usePathname } from "next/navigation";
import { FileIcon, LayoutDashboardIcon, SettingsIcon, StarIcon, TagIcon, type LucideIcon } from "lucide-react";

interface Section {
    icon: LucideIcon;
    label: string;
    iconClassName: string;
}

const sections: Record<string, Section> = {
    "/dashboard": {
        icon: LayoutDashboardIcon,
        label: "Dashboard",
        iconClassName: "text-primary",
    },
    "/dashboard/notes": {
        icon: FileIcon,
        label: "Notes",
        iconClassName: "text-primary",
    },
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
    "/dashboard/settings": {
        icon: SettingsIcon,
        label: "Settings",
        iconClassName: "text-muted-foreground",
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
