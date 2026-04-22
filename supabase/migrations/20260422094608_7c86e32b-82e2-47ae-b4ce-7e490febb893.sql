
-- Replace overly broad storage SELECT with a still-public-readable but path-scoped policy
DROP POLICY "public read project images" ON storage.objects;
CREATE POLICY "public read project images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'project-images'
    AND (storage.foldername(name))[1] = 'public'
  );

-- Replace permissive insert on messages with a validated insert
DROP POLICY "anyone insert messages" ON public.messages;
CREATE POLICY "anyone insert valid messages" ON public.messages
  FOR INSERT WITH CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(email) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(message) BETWEEN 1 AND 2000
  );
