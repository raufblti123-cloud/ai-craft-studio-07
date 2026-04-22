export type Profile = {
  id: string;
  name: string;
  role: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  languages: string[];
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
};

export type Skill = { id: string; name: string; level: string | null; sort_order: number };
export type Project = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  sort_order: number;
};
export type Service = { id: string; title: string; description: string | null; icon: string | null; sort_order: number };
export type Message = { id: string; name: string; email: string; message: string; read: boolean; created_at: string };
