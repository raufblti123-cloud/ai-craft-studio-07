import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { Profile } from "@/lib/types";

export const Footer = ({ profile }: { profile: Profile | null }) => (
  <footer className="border-t border-border mt-32">
    <div className="container-tight py-10 flex flex-col md:flex-row gap-6 items-center justify-between">
      <div className="font-mono text-xs text-muted-foreground tracking-widest">
        © {new Date().getFullYear()} {profile?.name ?? "RAUF KHAN"} — ALL SYSTEMS NOMINAL
      </div>
      <div className="flex items-center gap-4">
        {profile?.github_url && (
          <a href={profile.github_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition" aria-label="GitHub">
            <Github size={18} />
          </a>
        )}
        {profile?.linkedin_url && (
          <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition" aria-label="LinkedIn">
            <Linkedin size={18} />
          </a>
        )}
        {profile?.twitter_url && (
          <a href={profile.twitter_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition" aria-label="Twitter">
            <Twitter size={18} />
          </a>
        )}
        {profile?.email && (
          <a href={`mailto:${profile.email}`} className="text-muted-foreground hover:text-primary transition" aria-label="Email">
            <Mail size={18} />
          </a>
        )}
      </div>
    </div>
  </footer>
);
