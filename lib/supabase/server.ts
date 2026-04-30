
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'



export async function createServerSupabase() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignored if called from a Server Component
          }
        },
      },
    }
  )
}

export async function getUser() {
  const supabase = await createServerSupabase();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    console.error("Error fetching user:", error);
    return null;
  }

  return user;
}

export async function getSession() {
  const supabase = await createServerSupabase();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    console.error("Error fetching session:", error);
    return null;
  }

  return session;
}