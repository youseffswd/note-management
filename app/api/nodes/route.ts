import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const supabase = await createServerSupabase();

    const { data: notes, error: noteError } = await supabase
        .from("notes")
        .select("*");
    const { data: folders, error: folderError } = await supabase
        .from("folders")
        .select("*");
    if (noteError || folderError) {
        console.error("Error fetching data:", noteError, folderError);
        return new Response(
            JSON.stringify({
                error: "Failed to fetch notes and folders",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            },
        );
    }
    const mappedNotes: Note[] = notes.map(note => ({
        ...note,
        parentId: note.folderId,
        folderId: undefined,
        type: "note",
    }));
    const mappedFolders: Folder[] = folders.map(folder => ({
        ...folder,
        children: [],
        type: "folder",
    }));
    return new Response(
        JSON.stringify({
            folders: mappedFolders,
            notes: mappedNotes,
        }),
        {
            headers: { "Content-Type": "application/json" },
        },
    );
}
    // const folders: Folder[] = [
    // Day 1 Morning Session
    // {
    // id: "1",
    // name: "Folder 1",
    // parentId: null,
    // children: [],
    // createdAt: new Date("2023-10-25T09:00:00Z"),
    // },
    // {
    // id: "2",
    // name: "Folder 2",
    // parentId: null,
    // children: [],
    // createdAt: new Date("2023-10-25T09:15:30Z"),
    // },
    // {
    // id: "3",
    // name: "Subfolder 1",
    // parentId: "1",
    // children: [],
    // createdAt: new Date("2023-10-25T09:45:00Z"),
    // },
    // {
    // id: "4",
    // name: "Subfolder 2",
    // parentId: "1",
    // children: [],
    // createdAt: new Date("2023-10-25T10:10:15Z"),
    // },
    //
    // Day 2 Afternoon Session
    // {
    // id: "5",
    // name: "Subfolder 3",
    // parentId: "2",
    // children: [],
    // createdAt: new Date("2023-10-26T14:05:00Z"),
    // },
    // {
    // id: "6",
    // name: "sub Subfolder 4",
    // parentId: "3",
    // children: [],
    // createdAt: new Date("2023-10-26T14:30:45Z"),
    // },
    //
    // Day 3 Morning Session
    // {
    // id: "7",
    // name: "Folder 3",
    // parentId: null,
    // children: [],
    // createdAt: new Date("2023-10-27T08:20:00Z"),
    // },
    // {
    // id: "8",
    // name: "Subfolder 5",
    // parentId: "7",
    // children: [],
    // createdAt: new Date("2023-10-27T08:25:10Z"),
    // },
    // {
    // id: "9",
    // name: "sub Subfolder 6",
    // parentId: "8",
    // children: [],
    // createdAt: new Date("2023-10-27T08:50:00Z"),
    // },
    // ];
    //
    // const notes: Note[] = [
    //     // Notes added shortly after their parent folders were created
    //     {
    //         id: "100",
    //         title: "Note 1",
    //         description: "Initial thoughts",
    //         content: "Content 1...",
    //         parentId: null,
    //         createdAt: new Date("2023-10-25T09:50:00Z"),
    //     },
    //     {
    //         id: "200",
    //         title: "Note 2",
    //         description: "Follow-up details",
    //         content: "Content 2...",
    //         parentId: "4",
    //         createdAt: new Date("2023-10-25T10:15:00Z"),
    //     },
    //     {
    //         id: "300",
    //         title: "Note 3",
    //         description: "Personal log",
    //         content: "Content 3...",
    //         parentId: "5",
    //         createdAt: new Date("2023-10-26T14:15:30Z"),
    //     },
    //     {
    //         id: "400",
    //         title: "Note 4",
    //         description: "Deep dive research",
    //         content: "Content 4...",
    //         parentId: "6",
    //         createdAt: new Date("2023-10-26T14:45:00Z"),
    //     },
    //     // Notes added to the same folder in a burst
    //     {
    //         id: "500",
    //         title: "Note 5",
    //         description: "Additional research",
    //         content: "Content 5...",
    //         parentId: "6",
    //         createdAt: new Date("2023-10-26T14:50:15Z"),
    //     },
    //     {
    //         id: "600",
    //         title: "Note 6",
    //         description: "Summary",
    //         content: "Content 6...",
    //         parentId: "6",
    //         createdAt: new Date("2023-10-26T15:05:00Z"),
    //     },
    //     // Notes added to root folders
    //     {
    //         id: "700",
    //         title: "Note 7",
    //         description: "Quick reminder",
    //         content: "Content 7...",
    //         parentId: "1",
    //         createdAt: new Date("2023-10-26T17:30:00Z"),
    //     },
    //     {
    //         id: "800",
    //         title: "Note 8",
    //         description: "Brainstorming list",
    //         content: "Content 8...",
    //         parentId: "2",
    //         createdAt: new Date("2023-10-27T09:00:00Z"),
    //     },
    //     // Notes added deep in the new Day 3 folders
    //     {
    //         id: "900",
    //         title: "Note 9",
    //         description: "Project outline",
    //         content: "Content 9...",
    //         parentId: "8",
    //         createdAt: new Date("2023-10-27T08:35:00Z"),
    //     },
    //     {
    //         id: "1000",
    //         title: "Note 10",
    //         description: "Final draft",
    //         content: "Content 10...",
    //         parentId: "9",
    //         createdAt: new Date("2023-10-27T09:10:45Z"),
    //     },
    // ];
