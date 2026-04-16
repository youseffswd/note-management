"use client"

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import useNoteStore from "@/store/note-management"
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import { useEffect } from "react"


const Sidebar = ({nodes} : { nodes: {folders:Folder[], notes:Note[]}}) => {

  const initilizeNoteStore = useNoteStore(state => state.initilizeNoteStore);

  useEffect(() => {
    initilizeNoteStore(nodes.folders,nodes.notes);
  },[nodes, initilizeNoteStore])


    const renderItem = (node: Folder | Note) => {
    if ("children" in node) {
      return (
        <Collapsible key={node.id}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
              <FolderIcon className="text-chart-5 fill-current" />
              {node.name}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 ml-5 style-lyra:ml-4">
            <div className="flex flex-col gap-1">
              {node.children.map((child) => renderItem(child))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )
    }
    return (
      <Button
        key={node.id}
        variant="link"
        size="sm"
        className="w-full justify-start gap-2 text-foreground"
      >
        <FileIcon />
        <span>{node.title}</span>
      </Button>
    )
  }



  return (
    <div className="w-64 h-screen bg-sidebar p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Sidebar</h2>
      <div className="flex flex-col gap-2">
        {nodes.folders.map((folder) => renderItem(folder))}
      </div>

    </div> 
  )
}

export default Sidebar

