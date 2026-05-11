import { getNodes } from "@/features/nodes/api/nodes.service";
import { ResponseError } from "@/shared/lib/errors";



export const dynamic = "force-dynamic";

export async function GET(request: Request) {

  try {
    const data = await getNodes();
    return new Response(
      JSON.stringify(data),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error fetching nodes:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: (error as any) instanceof ResponseError ? (error as any).status : 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}



// export async function POST(request: Request) {
//     const supabase = await createServerSupabase();
//     const body = await request.json();
//     let response;
//     if(body.type === "note"){
//       const note: Note = body;
//       response = await supabase.from("notes").insert({
//         id: note.id,
//         title: note.title,
//         content: note.content,
//         folderId: note.parentId,
//         description: note.description,
//         userId: note.userId,

//       })
//     }else {
//       const folder: Folder = body;
//       response = await supabase.from("folders").insert({
//         id: folder.id,
//         name: folder.name,
//         parentId: folder.parentId,
//         userId: folder.userId,
//         colorClass: folder.colorClass,
//       })
//     }
    
//     if(response.error){
//       console.error("Error inserting data:", response.error);
//       return new Response(
//         JSON.stringify({
//           error: response.error.message,
//         }),
//         {
//           status: response.status,
//           headers: { "Content-Type": "application/json" },
//         },
//       );
//     }
//     return new Response(
//       JSON.stringify({message: "Node created successfully"}),
//       {
//         headers: { "Content-Type": "application/json" },
//       },
//     )
// }

