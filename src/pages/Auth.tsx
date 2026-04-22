import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, ADMIN_EMAIL } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Lock, ArrowLeft } from "lucide-react";

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user) return <Navigate to="/admin" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "signup") {
      if (email !== ADMIN_EMAIL) {
        setBusy(false);
        toast.error("This portfolio only allows the owner to register.");
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. You can sign in now.");
      setMode("signin");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error(error.message);
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary inline-flex items-center gap-2 mb-8">
          <ArrowLeft size={14} /> Back to site
        </Link>
        <div className="border border-border bg-card/60 backdrop-blur p-8 corner-brackets relative">
          <div className="flex items-center gap-3 mb-2">
            <Lock size={16} className="text-primary" />
            <span className="label-mono">Restricted</span>
          </div>
          <h1 className="font-display text-3xl font-medium mb-1">Admin Access</h1>
          <p className="text-sm text-muted-foreground mb-8">
            {mode === "signin" ? "Sign in to manage content." : "Create the owner account."}
          </p>

          <form onSubmit={submit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-input border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary"
              placeholder="email"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-input border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary"
              placeholder="password"
            />
            <button
              disabled={busy}
              className="w-full bg-primary text-primary-foreground py-3 font-mono text-sm uppercase tracking-widest hover:glow-ring transition disabled:opacity-50"
            >
              {busy ? "..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <button
            onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
            className="mt-6 text-xs font-mono text-muted-foreground hover:text-primary"
          >
            {mode === "signin" ? "→ First time? Create owner account" : "→ Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
