import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Set cookies on the request
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          
          // Re-create the response to apply the cookies
          supabaseResponse = NextResponse.next({ request });
          
          // Set cookies on the response
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.getUser();
 

  // protect routes that require authentication
  const pathname = request.nextUrl.pathname;
  const protectedRoutes = ["/dashboard"];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if(isProtected && error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  return supabaseResponse;
}