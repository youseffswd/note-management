
import { cn } from "@/shared/lib/utils";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    showText?: boolean;
}

const sizeMap = {
    xs: {
        container: "gap-1.5",
        iconBox: "w-6 h-6 rounded-md",
        svg: "w-3.5 h-3.5",
        strokeWidth: 2,
        text: "text-sm font-semibold tracking-tight",
    },
    sm: {
        container: "gap-2",
        iconBox: "w-8 h-8 rounded-lg",
        svg: "w-4.5 h-4.5",
        strokeWidth: 2,
        text: "text-base font-semibold tracking-tight",
    },
    md: {
        container: "gap-2.5",
        iconBox: "w-10 h-10 rounded-xl",
        svg: "w-5.5 h-5.5",
        strokeWidth: 2.25,
        text: "text-lg font-bold tracking-tight",
    },
    lg: {
        container: "gap-3",
        iconBox: "w-12 h-12 rounded-xl",
        svg: "w-6.5 h-6.5",
        strokeWidth: 2.5,
        text: "text-xl font-bold tracking-tight",
    },
    xl: {
        container: "gap-3.5",
        iconBox: "w-16 h-16 rounded-2xl",
        svg: "w-9 h-9",
        strokeWidth: 2.5,
        text: "text-3xl font-extrabold tracking-tight",
    },
    "2xl": {
        container: "gap-4",
        iconBox: "w-20 h-20 rounded-3xl",
        svg: "w-11 h-11",
        strokeWidth: 2.75,
        text: "text-4xl font-extrabold tracking-tight",
    },
};

export function Logo({
    size = "md",
    showText = true,
    className,
    ...props
}: LogoProps) {
    const config = sizeMap[size];

    return (
        <div
            className={cn("inline-flex items-center select-none", config.container, className)}
            {...props}
        >
            <div
                className={cn(
                    "flex items-center justify-center bg-linear-to-br from-[#4f8ef7] to-[#9d7cf4] shadow-sm shrink-0",
                    config.iconBox
                )}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={config.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn("text-white", config.svg)}
                >
                    {/* Document Page outline with fold */}
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L15 2z" />
                    <polyline points="15 2 15 7.5 20 7.5" />
                    
                    {/* Inner content */}
                    {/* The X mark on the left */}
                    <line x1="7" y1="11" x2="9" y2="13" />
                    <line x1="9" y1="11" x2="7" y2="13" />
                    
                    {/* Short line next to X */}
                    <line x1="12" y1="12" x2="17" y2="12" />
                    
                    {/* Second full line */}
                    <line x1="7" y1="16" x2="17" y2="16" />
                    
                    {/* Third full line */}
                    <line x1="7" y1="20" x2="17" y2="20" />
                </svg>
            </div>
            {showText && (
                <span className={cn("text-foreground font-sans", config.text)}>
                    NoteFlow
                </span>
            )}
        </div>
    );
}
