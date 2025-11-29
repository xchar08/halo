import { NextRequest, NextResponse } from "next/server";
import { runResearchAgent } from "@/lib/agents/workflow";

// VERCEL CONFIG: Critical for preventing timeouts
export const maxDuration = 60; // Allow up to 60s execution
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { projectId } = await req.json();
    
    if (!projectId) {
        return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }

    // AWAIT execution so Vercel doesn't kill the process early
    console.log(`[API] Starting Agent for ${projectId}...`);
    await runResearchAgent(projectId);
    console.log(`[API] Agent Completed for ${projectId}`);

    return NextResponse.json({ success: true, message: "Agent finished successfully" });
  } catch (error: any) {
    console.error("[API] Agent Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
