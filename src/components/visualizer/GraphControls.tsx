"use client";

import { Button } from "@/components/ui/button";
import { useGraphStore } from "@/store/graph-store";
import { Maximize, Pause, Play, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export function GraphControls() {
  // Now setIsPaused exists in the store
  const { isPaused, setIsPaused, triggerReset } = useGraphStore();
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      {/* Navigation Group */}
      <div className="flex items-center gap-1 mr-4 border-r border-zinc-800 pr-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-black/50 border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white h-9 w-9" 
            onClick={() => router.push('/')}
            title="Back to Dashboard"
          >
            <Home className="h-4 w-4" />
          </Button>
      </div>

      {/* Graph Group */}
      <div className="bg-black/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-1 flex gap-1">
        <Button 
            variant="ghost" 
            size="sm" 
            className="text-zinc-400 hover:text-white h-8 px-3 text-xs font-medium"
            onClick={triggerReset}
        >
            <Maximize className="h-3.5 w-3.5 mr-2" />
            Reset View
        </Button>
        
        <Button 
            variant="ghost" 
            size="sm" 
            className={`h-8 w-8 p-0 ${isPaused ? 'text-yellow-400' : 'text-zinc-400 hover:text-white'}`}
            onClick={() => setIsPaused(!isPaused)} // Now valid
        >
            {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>
  );
}
