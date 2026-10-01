import { FilePlus, FolderPlus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/shared/components/ui/tooltip";
interface ExplorerActions {
    addNote: () => void;
    addFolder: () => void;
}

const ExplorerActions = ({ addNote, addFolder }: ExplorerActions) => {
    return (
        <TooltipProvider delayDuration={300}>
            <div className="flex items-center shrink-0">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={addNote}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
                        >
                            <FilePlus className="h-4 w-4" />
                            <span className="sr-only">New Note</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                        <p>New Note</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={addFolder}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
                        >
                            <FolderPlus className="h-4 w-4" />
                            <span className="sr-only">New Folder</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                        <p>New Folder</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
};

export default ExplorerActions;
