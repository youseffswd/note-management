import { useLandingReducedMotion } from "../../hooks/use-landing-reduced-motion";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface PreviewChecklistProps {
    noteId: string;
    tasks: string[];
    checked: string[];
    onToggle: (taskId: string) => void;
}

export default function PreviewChecklist({
    noteId,
    tasks,
    checked,
    onToggle,
}: PreviewChecklistProps) {
    const reducedMotion = useLandingReducedMotion();

    return (
        <div className="mt-4 grid gap-1">
            {tasks.map((task, index) => {
                const taskId = `${noteId}-${index}`;
                const isChecked = checked.includes(taskId);

                return (
                    <label
                        key={taskId}
                        className="relative flex min-h-10 cursor-pointer items-center gap-2.5 text-xs leading-relaxed text-secondary-foreground sm:text-sm"
                    >
                        <input
                            type="checkbox"
                            className="peer absolute z-10 size-4 cursor-pointer opacity-0"
                            checked={isChecked}
                            onChange={() => onToggle(taskId)}
                        />
                        <motion.span
                            initial={false}
                            animate={{
                                backgroundColor: isChecked
                                    ? "var(--primary)"
                                    : "rgba(0, 0, 0, 0)",
                                borderColor: isChecked
                                    ? "var(--primary)"
                                    : "var(--muted-foreground)",
                                color: isChecked
                                    ? "var(--primary-foreground)"
                                    : "rgba(0, 0, 0, 0)",
                                scale:
                                    isChecked && !reducedMotion
                                        ? [1, 1.2, 1]
                                        : 1,
                            }}
                            transition={{ duration: reducedMotion ? 0 : 0.2 }}
                            className="pointer-events-none flex size-4 shrink-0 items-center justify-center rounded-sm border peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background"
                            aria-hidden="true"
                        >
                            <Check size={12} />
                        </motion.span>
                        <motion.span
                            className="peer-checked:line-through"
                            initial={false}
                            animate={{
                                color: isChecked
                                    ? "var(--muted-foreground)"
                                    : "var(--secondary-foreground)",
                            }}
                            transition={{ duration: reducedMotion ? 0 : 0.2 }}
                        >
                            {task}
                        </motion.span>
                    </label>
                );
            })}
        </div>
    );
}
