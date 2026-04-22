import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Projects } from "@/components/site/Projects";
import { Services } from "@/components/site/Services";
import { Contact } from "@/components/site/Contact";
import { Profile, Project, Service, Skill } from "@/lib/types";

const Index = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    (async () => {
      const [p, s, pr, sv] = await Promise.all([
        supabase.from("profile").select("*").limit(1).maybeSingle(),
        supabase.from("skills").select("*").order("sort_order"),
        supabase.from("projects").select("*").order("sort_order"),
        supabase.from("services").select("*").order("sort_order"),
      ]);
      if (p.data) setProfile(p.data as Profile);
      if (s.data) setSkills(s.data as Skill[]);
      if (pr.data) setProjects(pr.data as Project[]);
      if (sv.data) setServices(sv.data as Service[]);
    })();
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero profile={profile} />
        <About profile={profile} skills={skills} />
        <Projects projects={projects} />
        <Services services={services} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
};

export default Index;
