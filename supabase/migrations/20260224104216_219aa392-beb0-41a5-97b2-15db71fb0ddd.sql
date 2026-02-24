
-- Update existing bucket to ensure correct config
UPDATE storage.buckets 
SET public = true, 
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav']
WHERE id = 'cms-media';

-- Create policies (use IF NOT EXISTS pattern via DO block)
DO $$
BEGIN
  -- Public read
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read access for cms-media' AND tablename = 'objects') THEN
    CREATE POLICY "Public read access for cms-media" ON storage.objects FOR SELECT USING (bucket_id = 'cms-media');
  END IF;
  -- Authenticated upload
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can upload to cms-media' AND tablename = 'objects') THEN
    CREATE POLICY "Authenticated users can upload to cms-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cms-media' AND auth.role() = 'authenticated');
  END IF;
  -- Authenticated update
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can update cms-media' AND tablename = 'objects') THEN
    CREATE POLICY "Authenticated users can update cms-media" ON storage.objects FOR UPDATE USING (bucket_id = 'cms-media' AND auth.role() = 'authenticated');
  END IF;
  -- Authenticated delete
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can delete from cms-media' AND tablename = 'objects') THEN
    CREATE POLICY "Authenticated users can delete from cms-media" ON storage.objects FOR DELETE USING (bucket_id = 'cms-media' AND auth.role() = 'authenticated');
  END IF;
END $$;
