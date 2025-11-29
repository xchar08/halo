import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Check if user exists in public.users table, if not create them
      // This syncs Auth Users -> Public Users for foreign keys
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
          const { error: upsertError } = await supabase.from("users").upsert({
              userId: user.id,
              email: user.email || "",
              research_tier: 'standard'
          }, { onConflict: 'userId' });
          
          if (upsertError) console.error("Failed to sync user profile:", upsertError);
      }

      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${requestUrl.origin}/login?error=auth-code-error`);
}
