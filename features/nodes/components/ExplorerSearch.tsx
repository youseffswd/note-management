import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

interface ExplorerSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ExplorerSearch = ({ searchQuery, setSearchQuery }: ExplorerSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <Input
        type="search"
        placeholder="Search notes..."
        className="pl-8 bg-sidebar-accent/50 border-sidebar-border focus-visible:ring-sidebar-ring h-9"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search notes"
      />
    </div>
  );
};

export default ExplorerSearch;
