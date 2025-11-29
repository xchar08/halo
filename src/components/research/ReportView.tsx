"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FileText, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // Import KaTeX styles
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportViewProps {
  projectId: string;
}

export function ReportView({ projectId }: ReportViewProps) {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    const supabase = createClient();
    
    console.log("[ReportView] Fetching report for:", projectId);

    const { data, error } = await supabase
      .from("validation_reports")
      .select("summary_markdown, created_at")
      .eq("project_id", projectId)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(); 

    if (error) {
      console.error("[ReportView] Error fetching report:", error);
      setReport(null);
    } else if (data) {
      setReport(data.summary_markdown);
      setLastUpdated(new Date(data.created_at));
    } else {
      setReport(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
    const supabase = createClient();
    const channel = supabase.channel(`report-updates-${projectId}`)
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'validation_reports', filter: `project_id=eq.${projectId}` },
            () => fetchReport()
        )
        .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectId]);

  if (loading && !report) {
    return (
        <div className="p-8 space-y-4 max-w-3xl mx-auto">
            <Skeleton className="h-8 w-3/4 bg-zinc-800" />
            <Skeleton className="h-4 w-full bg-zinc-800" />
            <Skeleton className="h-4 w-5/6 bg-zinc-800" />
        </div>
    );
  }

  if (!report) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4 p-8">
            <FileText className="h-12 w-12 opacity-50" />
            <p>No report generated yet.</p>
            <Button variant="outline" onClick={fetchReport}>Check Updates</Button>
        </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full bg-zinc-950 text-zinc-300 px-4 md:px-8 py-6">
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <div>
                <h1 className="text-2xl font-bold text-zinc-100">Research Findings</h1>
                {lastUpdated && (
                    <p className="text-xs text-zinc-500 mt-1">
                        {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString()}
                    </p>
                )}
            </div>
            <Button size="sm" variant="ghost" onClick={fetchReport}>
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
        </div>

        <article className="prose prose-invert prose-zinc max-w-none">
            <ReactMarkdown
                // ENABLE MATH PLUGINS
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                
                components={{
                    h1: (props: any) => <h1 className="text-2xl font-bold text-white mt-8 mb-4" {...props} />,
                    h2: (props: any) => <h2 className="text-xl font-semibold text-indigo-400 mt-6 mb-3" {...props} />,
                    h3: (props: any) => <h3 className="text-lg font-medium text-zinc-200 mt-4 mb-2" {...props} />,
                    p: (props: any) => <p className="leading-7 mb-4 text-zinc-300" {...props} />,
                    ul: (props: any) => <ul className="list-disc ml-6 mb-4" {...props} />,
                    li: (props: any) => <li className="text-zinc-300 pl-1" {...props} />,
                    strong: (props: any) => <strong className="font-bold text-zinc-100" {...props} />,
                    a: (props: any) => <a className="text-indigo-400 hover:underline" {...props} />
                }}
            >
                {report}
            </ReactMarkdown>
        </article>
      </div>
    </ScrollArea>
  );
}
