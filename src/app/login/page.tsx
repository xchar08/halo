"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { StarField } from "@/components/ui/star-field"; 
import { BorderBeam } from "@/components/ui/border-beam"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) setMessage({ type: 'error', text: error.message });
    else setMessage({ type: 'success', text: "Check your email for the magic link!" });
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-zinc-50 flex items-center justify-center relative overflow-hidden p-4">
      
      {/* Simplified Background */}
      <StarField density={80} speed={0.1} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="relative group">
            {/* Subtle Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition duration-1000"></div>
            
            <Card className="bg-zinc-950/80 backdrop-blur-xl border-zinc-800 shadow-2xl relative overflow-hidden">
            <CardHeader className="space-y-1 text-center pb-2">
                <CardTitle className="text-2xl font-bold tracking-tight text-white">
                Halo Access
                </CardTitle>
                <CardDescription className="text-zinc-400">
                Enter your credentials to access the intelligence grid.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <Input
                    type="email"
                    placeholder="researcher@institute.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/40 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all h-11"
                    required
                    />
                </div>
                
                {message && (
                    <div className={`p-3 rounded-md text-sm text-center border backdrop-blur-sm ${
                    message.type === 'success' 
                        ? 'bg-green-500/10 text-green-200 border-green-500/20' 
                        : 'bg-red-500/10 text-red-200 border-red-500/20'
                    }`}>
                    {message.text}
                    </div>
                )}

                <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-11 font-medium tracking-wide shadow-lg shadow-indigo-900/20"
                    disabled={loading}
                >
                    {loading ? "Authenticating..." : "Send Magic Link"}
                </Button>
                </form>
            </CardContent>
            
            {/* Beam Effect */}
            <BorderBeam size={200} duration={6} colorFrom="#6366f1" colorTo="transparent" />
            </Card>
        </div>
      </div>
    </main>
  );
}
