import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

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

  const { data, error } = await supabase.auth.getUser();
  const isLoggedIn = !error && !!data.user;

  const pathname = request.nextUrl.pathname;
  const matches = (routes: string[]) =>
    routes.some((route) => pathname.startsWith(route));

  // routes that require authentication (covers /dashboard/notes, etc.)
  const protectedRoutes = ["/dashboard"];
  // routes only for logged-out users
  const authRoutes = ["/login", "/sign-up"];

  const redirectTo = (path: string) => {
    const response = NextResponse.redirect(new URL(path, request.url));
    // keep refreshed session cookies on the redirect
    supabaseResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
    return response;
  };

  if (matches(protectedRoutes) && !isLoggedIn) {
    return redirectTo("/login");
  }

  if (matches(authRoutes) && isLoggedIn) {
    return redirectTo("/dashboard");
  }

  return supabaseResponse;
}