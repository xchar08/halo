import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BorderBeam } from "@/components/ui/border-beam";
import { RevealWrapper } from "@/components/ui/reveal-wrapper";
import { StarField } from "@/components/ui/star-field";
import { HaloDecoration } from "@/components/ui/halo-decoration";
import { DeleteProjectButton } from "@/components/research/DeleteProjectButton";

async function createProject(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const query = formData.get("query") as string;
  const depth = formData.get("depth") as string; // Capture depth

  if (!name) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase.from("projects").insert({
    name,
    description: query,
    owner_id: user.id, 
    raw_spec: query,
    settings: { depth } // Save setting
  }).select().single();

  if (error) throw new Error("Failed to create project");
  redirect(`/project/${data.id}`);
}

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  
  const { data: projects } = await supabase.from("projects").select("*").eq("owner_id", user.id).order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#050a14] to-black text-zinc-50 p-8 md:p-24 relative overflow-hidden">
      <StarField density={150} speed={0.3} />
      
      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        <RevealWrapper>
            <div className="space-y-2 mb-16 text-center md:text-left">
                <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-blue-300 to-yellow-100 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                    Halo Research
                </h1>
                <p className="text-blue-200/70 text-lg font-light tracking-wide">
                    Illuminating Intelligence & Graph Reasoning
                </p>
                <p className="text-zinc-500 text-sm">Logged in as: <span className="text-zinc-300">{user.email}</span></p>
            </div>

            <div className="relative group mt-20">
                <HaloDecoration /> 
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-yellow-500/20 rounded-xl blur-xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
                
                <Card className="bg-zinc-900/40 backdrop-blur-md border-white/10 relative overflow-visible shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3">
                            <div className="relative w-4 h-4">
                                <div className="absolute inset-0 border border-yellow-400 rounded-full animate-ping opacity-75"></div>
                                <div className="relative w-full h-full bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
                            </div>
                            <span className="text-yellow-50 font-medium">Begin New Inquiry</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={createProject} className="flex flex-col md:flex-row gap-4 items-end relative z-10">
                        <div className="space-y-2 flex-1 w-full">
                            <label className="text-xs font-medium text-cyan-200/70 uppercase tracking-wider">Project Name</label>
                            <Input name="name" placeholder="e.g. Orbital Mechanics" className="bg-black/30 border-white/10 text-white focus:ring-cyan-500/50" required />
                        </div>
                        <div className="space-y-2 flex-[2] w-full">
                            <label className="text-xs font-medium text-cyan-200/70 uppercase tracking-wider">Initial Query</label>
                            <Input name="query" placeholder="What mystery shall we solve?" className="bg-black/30 border-white/10 text-white focus:ring-yellow-500/50" />
                        </div>
                        {/* DEPTH TOGGLE */}
                        <div className="space-y-2 w-full md:w-40">
                            <label className="text-xs font-medium text-cyan-200/70 uppercase tracking-wider">Monitor Depth</label>
                            <select name="depth" className="bg-black/30 border-white/10 text-white text-sm rounded-md w-full h-10 px-3 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none">
                                <option value="standard">Standard (Fast)</option>
                                <option value="deep">Deep (Full Scan)</option>
                            </select>
                        </div>
                        <Button type="submit" className="w-full md:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-400/30 shadow-[0_0_20px_rgba(8,145,178,0.4)]">
                            Launch
                        </Button>
                        </form>
                    </CardContent>
                    <BorderBeam colorFrom="#fcd34d" colorTo="#22d3ee" size={400} duration={10} />
                </Card>
            </div>
        </RevealWrapper>

        <RevealWrapper delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {projects?.map((project) => (
                <Link key={project.id} href={`/project/${project.id}`}>
                <Card className="h-full bg-zinc-900/30 backdrop-blur-sm border-white/5 hover:bg-zinc-900/50 transition-all hover:border-cyan-500/30 cursor-pointer group relative overflow-hidden">
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <DeleteProjectButton projectId={project.id} />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-lg text-zinc-200 group-hover:text-cyan-300 transition-colors">{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors line-clamp-3">{project.description || "No description provided."}</p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-cyan-600/60 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50"></span>
                            {new Date(project.created_at).toLocaleDateString()}
                        </div>
                    </CardContent>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                        <BorderBeam size={200} duration={5} colorFrom="#22d3ee" colorTo="transparent" />
                    </div>
                </Card>
                </Link>
            ))}
            </div>
        </RevealWrapper>
      </div>
    </main>
  );
}
