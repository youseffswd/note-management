import { Check, ListTodo } from "lucide-react";

export default function WritingIllustration() {
    return (
        <div className="mt-auto pt-7" aria-hidden="true">
            <div className="relative -mb-3 -rotate-2 overflow-hidden rounded-lg border border-border bg-background">
                <div className="flex items-center gap-5 border-b border-border bg-secondary/40 px-4 py-3 text-xs text-secondary-foreground">
                    <b>H₁</b>
                    <span className="h-3 w-px bg-border" />
                    <b>B</b>
                    <i>I</i>
                    <ListTodo size={16} />
                </div>
                <div className="p-5 pb-8">
                    <span className="text-sm font-medium">
                        Every great thing starts
                        <br />
                        with a little idea
                        <span className="ml-1 inline-block h-4 w-px bg-primary align-middle" />
                    </span>
                    <div className="mt-4 h-1 w-11/12 rounded-full bg-secondary" />
                    <div className="mt-2 h-1 w-2/3 rounded-full bg-secondary" />
                    <p className="mt-5 flex items-center gap-2 text-[10px] text-muted-foreground">
                        <Check size={13} className="text-chart-2" />
                        Make something meaningful
                    </p>
                </div>
            </div>
        </div>
    );
}
