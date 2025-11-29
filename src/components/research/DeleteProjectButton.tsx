"use client";

import { Trash2 } from "lucide-react";
import { deleteProject } from "@/app/actions/research";
import { useTransition } from "react";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop navigation to the project page
    e.stopPropagation(); // Stop bubbling

    if (confirm("Are you sure you want to delete this project? This cannot be undone.")) {
      startTransition(async () => {
        await deleteProject(projectId);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors z-20 relative group/delete"
      title="Delete Project"
    >
      <Trash2 className={`w-4 h-4 ${isPending ? "animate-pulse" : ""}`} />
    </button>
  );
}
