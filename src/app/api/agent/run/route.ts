import { NextRequest, NextResponse } from "next/server";
import { runResearchAgent } from "@/lib/agents/workflow";

export async function POST(req: NextRequest) {
  try {
    const { projectId } = await req.json();
    
    if (!projectId) {
        return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }

    // Run the agent workflow asynchronously (fire and forget)
    // Note: In production, this should be a background job (BullMQ/Inngest)
    // For MVP, we just start the promise and return immediately.
    runResearchAgent(projectId).catch(err => console.error("Agent crashed:", err));

    return NextResponse.json({ success: true, message: "Agent started" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
