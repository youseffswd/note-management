import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";



export async function POST(request: Request){
  const { email, password, fullName } = await request.json();
  const supabase = await createServerSupabase();
  const {error} = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });
  
  if(error){
    console.error("Error signing up:", error);
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: error.status || 400,
      }
    );
  }
  
  return NextResponse.json({
    message: "User signed up successfully. Please check your email to confirm your account."
  });

}


// function test(){
//   fetch("http://localhost:3000/api/auth/sign-up", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       email: "test@example.com",
//       password: "123456",
//       fullName: "Test User"
//     })
//   }).then(response => response.json()).then(data => console.log(data)).catch(error => console.error("Error:", error));
// }