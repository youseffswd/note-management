
import { create } from "zustand";
import {immer} from "zustand/middleware/immer";


type Node = Folder | Note;

interface NoteStore { 
  nodes: Node[];
  nodesHash: Record<string, Node>;
  loading:boolean;
  initilizeNoteStore: () => void;
}




const useNoteStore = create<NoteStore>()(immer((set, get) => ({
  nodes: [],
  nodesHash: {},
  loading: false,
  initilizeNoteStore: async () => {
    set({loading:true})
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/nodes`);
    const { folders, notes }: { folders: Folder[]; notes: Note[] } = await response.json();
    const allNodes = [...folders, ...notes].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    const nodesHash = allNodes.reduce(
      (acc, node) => {
        acc[node.id] = node;
        return acc;
      },
      {} as Record<string, Node>,
    );
    const nestedNodes = allNodes.filter(node => !node.parentId);
    for (const node of allNodes) {
      if (!node.parentId) continue;
      const parentNode = nodesHash[node.parentId];
      if ("children" in parentNode) {
        parentNode.children.push(node);
      }
    }
    set({ nodes: nestedNodes, nodesHash, loading: false });
  },

})));


export default useNoteStore;