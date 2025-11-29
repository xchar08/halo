import { NextResponse } from "next/server";
import { monitorSources } from "@/lib/agents/nodes/monitor-sources";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 300; // 5 minutes (Requires Vercel Pro) - or split logic

export async function GET(req: Request) {
  console.log("[Cron] Starting Dynamic Project Update...");
  const supabase = await createClient();

  try {
    // 1. Find 'Active' Projects (e.g. created/updated in last 7 days)
    // Limit to 3-5 to avoid timeout
    const { data: activeProjects } = await supabase
        .from('projects')
        .select('id, name, raw_spec, settings')
        .order('created_at', { ascending: false })
        .limit(3);

    if (!activeProjects || activeProjects.length === 0) {
        return NextResponse.json({ message: "No active projects to update." });
    }

    const results = [];

    // 2. Run Monitor for EACH project context
    for (const project of activeProjects) {
        console.log(`[Cron] Updating Project: ${project.name} (${project.id})`);

        // Mock state for this specific project
        // Note: monitorSources uses the project ID to save documents
        const state: any = {
            projectId: project.id,
            query: project.raw_spec, 
            seedPapers: [] 
        };

        // Trigger the scan
        // This will save new docs specifically to THIS project's ID
        // So when you open the project page, new nodes appear.
        const outcome = await monitorSources(state);
        
        results.push({ 
            project: project.name, 
            new_docs: outcome.logs?.filter(l => l.message.includes("Ingested")).length || 0 
        });
    }

    return NextResponse.json({ 
        success: true, 
        updates: results 
    });

  } catch (error: any) {
    console.error("[Cron] Dynamic Monitor Failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
