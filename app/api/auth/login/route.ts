import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export async function POST(request: Request) {
    const { email, password } = await request.json();

    const supabase = createServerSupabase();

    const { data, error } = await (
        await supabase
    ).auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.log(error);
        console.error("Login error:", error);
        return new Response(
          JSON.stringify({ error: error.message }), {
            status: error.status || 400,
        });
    }

    return NextResponse.json({
        user: data.user,
        session: data.session,
    });
}
//

// function test() {
    // fetch("http://localhost:3000/api/auth/login", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //         email: "user@example.com",
    //         password: "password",
    //     }),
    // });
// }
