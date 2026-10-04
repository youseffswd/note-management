import { FileIcon, LayoutDashboardIcon, StarIcon, TagIcon, type LucideIcon } from "lucide-react";

export interface NavItem {
    href: string;
    icon: LucideIcon;
    label: string;
    /** Text shown in the left rail tooltip. Falls back to `label`. */
    tooltip?: string;
}

// Single source of truth for the dashboard navigation.
// Adding an entry here shows it in the desktop left rail (with its tooltip)
// and in the mobile bottom nav.
export const navItems: NavItem[] = [
    { href: "/dashboard", icon: LayoutDashboardIcon, label: "Dashboard" },
    { href: "/dashboard/notes", icon: FileIcon, label: "Notes", tooltip: "All notes" },
    { href: "/dashboard/starred", icon: StarIcon, label: "Starred", tooltip: "Starred notes" },
    { href: "/dashboard/tags", icon: TagIcon, label: "Tags", tooltip: "Browse by tag" },
];

export function isNavItemActive(pathname: string, href: string): boolean {
    return pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
}
