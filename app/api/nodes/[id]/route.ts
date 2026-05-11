export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return new Response("Not Implemented", { status: 501 });
}
