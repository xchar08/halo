import { NextResponse } from "next/server";
import { monitorSources } from "@/lib/agents/nodes/monitor-sources";
import { createClient } from "@/lib/supabase/server";

// Force dynamic (don't cache)
export const dynamic = 'force-dynamic'; 
// Attempt to set max duration, though Hobby caps at 10-60s anyway
export const maxDuration = 60; 

export async function GET(req: Request) {
  // Basic Security (optional for Hobby, but good practice)
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // return new NextResponse('Unauthorized', { status: 401 });
  }

  console.log("[Cron] Starting Hobby-Optimized Monitor...");
  const supabase = await createClient();

  try {
    // 1. LIMIT TO 1 PROJECT (To fit in 10s-60s timeout)
    // We fetch the single most recently updated project
    const { data: recentProject } = await supabase
        .from('projects')
        .select('id, name, raw_spec, settings')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (!recentProject) {
        return NextResponse.json({ message: "No projects found." });
    }

    console.log(`[Cron] Updating Single Target: ${recentProject.name}`);

    // 2. Prepare State
    const state: any = {
        projectId: recentProject.id,
        query: recentProject.raw_spec, 
        seedPapers: [] 
    };

    // 3. Run Monitor
    // This function picks 2 random sources. It should finish in ~15-20s.
    // If it consistently times out, reduce the loop inside monitorSources to 1 source.
    const outcome = await monitorSources(state);
        
    return NextResponse.json({ 
        success: true, 
        project: recentProject.name,
        new_docs: outcome.logs?.filter(l => l.message.includes("Ingested")).length || 0 
    });

  } catch (error: any) {
    console.error("[Cron] Failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
