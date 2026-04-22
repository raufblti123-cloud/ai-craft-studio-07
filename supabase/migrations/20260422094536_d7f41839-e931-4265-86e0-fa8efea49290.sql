
-- Profile (singleton: about/bio/contact info)
CREATE TABLE public.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT,
  email TEXT,
  bio TEXT,
  languages TEXT[] DEFAULT '{}',
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Admin check: only the owner email
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() AND email = 'raufblti123@gmail.com'
  );
$$;

-- Public read on portfolio content
CREATE POLICY "public read profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "public read services" ON public.services FOR SELECT USING (true);

-- Admin write
CREATE POLICY "admin write profile" ON public.profile FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin write skills" ON public.skills FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin write projects" ON public.projects FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin write services" ON public.services FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Messages: anyone can submit, only admin can read/manage
CREATE POLICY "anyone insert messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read messages" ON public.messages FOR SELECT USING (public.is_admin());
CREATE POLICY "admin update messages" ON public.messages FOR UPDATE USING (public.is_admin());
CREATE POLICY "admin delete messages" ON public.messages FOR DELETE USING (public.is_admin());

-- Storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);

CREATE POLICY "public read project images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "admin upload project images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-images' AND public.is_admin());
CREATE POLICY "admin update project images" ON storage.objects FOR UPDATE USING (bucket_id = 'project-images' AND public.is_admin());
CREATE POLICY "admin delete project images" ON storage.objects FOR DELETE USING (bucket_id = 'project-images' AND public.is_admin());
