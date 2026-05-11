import { createBrowserClient } from '@supabase/ssr'



export function createClientSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function getUser() {
  const supabase = createClientSupabase();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    console.error("Error fetching user:", error);
    return null;
  }

  return user;
}

export async function getSession() {
  const supabase = createClientSupabase();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    console.error("Error fetching session:", error);
    return null;
  }

  return session;
}