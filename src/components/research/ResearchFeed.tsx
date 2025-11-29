"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";

export function ResearchFeed() {
    const { id } = useParams();
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel('agent-logs')
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'agent_logs',
                filter: `project_id=eq.${id}` 
            }, (payload) => {
                setLogs(current => [payload.new, ...current]);
            })
            .subscribe();

        // Fetch initial logs
        const fetchLogs = async () => {
            const { data } = await supabase
                .from('agent_logs')
                .select('*')
                .eq('project_id', id)
                .order('created_at', { ascending: false });
            if (data) setLogs(data);
        };

        fetchLogs();

        return () => { supabase.removeChannel(channel); };
    }, [id]);

    const triggerAgent = async () => {
        setLoading(true);
        try {
            await fetch('/api/agent/run', { 
                method: 'POST', 
                body: JSON.stringify({ projectId: id }) 
            });
        } catch (e) {
            console.error(e);
        }
        // Don't set loading false immediately to prevent spamming
        setTimeout(() => setLoading(false), 5000);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-2 border-b border-zinc-800/50">
                <button 
                    onClick={triggerAgent}
                    disabled={loading}
                    className="w-full py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-xs text-zinc-300 rounded border border-zinc-700 transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                           <span className="animate-spin">⟳</span> Starting Agent...
                        </>
                    ) : (
                        "▶ Run Agent Workflow"
                    )}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {logs.length === 0 && (
                    <div className="text-center text-zinc-600 py-8 text-sm">
                        No logs yet. Start the agent.
                    </div>
                )}
                {logs.map((log, i) => (
                    <div key={i} className="text-sm font-mono border-l-2 border-blue-500/30 pl-3 py-1 animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] text-blue-400 uppercase tracking-wider">{log.step}</span>
                            <span className="text-[10px] text-zinc-600">{new Date(log.created_at).toLocaleTimeString()}</span>
                        </div>
                        <div className="text-zinc-300 leading-relaxed text-xs">{log.message}</div>
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <pre className="mt-1 text-[9px] text-zinc-500 overflow-x-auto">
                                {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
