"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe, Tag } from "lucide-react"; // Tag Icon
import { GLOBAL_SOURCES } from "@/lib/knowledge-base/sources";

export function GlobalFeed() {
  const [items, setItems] = useState<any[]>([]);
  
  useEffect(() => {
    const supabase = createClient();
    const fetchFeed = async () => {
        const { data } = await supabase
            .from('documents')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(25); // Increased limit
            
        if (data) {
            // Show anything with a source_name OR tags (Ontology items)
            const interestingDocs = data.filter((d: any) => d.metadata?.source_name || d.metadata?.tags);
            setItems(interestingDocs);
        }
    };

    fetchFeed();
    const channel = supabase.channel('global-feed').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'documents' }, fetchFeed).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="h-full flex flex-col bg-zinc-950">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                Global Intelligence
            </h2>
            <span className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">Live</span>
        </div>
        <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
                {items.map((item) => (
                    <div key={item.id} className="bg-zinc-900/30 border border-zinc-800/50 p-3 rounded-lg hover:border-zinc-700 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            {/* SOURCE BADGE */}
                            {item.metadata?.source_name ? (
                                <Badge variant="outline" className="text-[10px] h-5 text-blue-400 border-blue-400/20 bg-blue-400/5">
                                    {item.metadata.source_name}
                                </Badge>
                            ) : (
                                <span className="text-[10px] text-zinc-600">Web Search</span>
                            )}
                            
                            <span className="text-[10px] text-zinc-600 font-mono">
                                {new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>

                        <h3 className="text-sm font-medium text-zinc-300 leading-snug mb-1 group-hover:text-blue-200 transition-colors">
                            <a href={item.url} target="_blank" className="hover:underline decoration-blue-500/50 underline-offset-2">
                                {item.title}
                            </a>
                        </h3>

                        {/* ONTOLOGY TAGS (The "Autotag" Proof) */}
                        {item.metadata?.tags && item.metadata.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {item.metadata.tags.map((tag: string) => (
                                    <span key={tag} className="text-[10px] text-pink-400 bg-pink-400/5 border border-pink-400/20 px-1.5 rounded-full flex items-center gap-1">
                                        <Tag className="h-2 w-2" /> {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                
                {items.length === 0 && (
                    <div className="text-center text-zinc-600 text-xs py-10 px-4">
                        Waiting for intelligence stream...
                    </div>
                )}
            </div>
        </ScrollArea>
    </div>
  );
}
