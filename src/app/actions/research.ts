"use server";

import { runResearchAgent } from "@/lib/agents/workflow";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function startResearch(projectId: string) {
  // ... existing code ...
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    console.error("Delete error:", error);
    throw new Error("Failed to delete project");
  }

  revalidatePath("/"); // Refresh the dashboard list
}
