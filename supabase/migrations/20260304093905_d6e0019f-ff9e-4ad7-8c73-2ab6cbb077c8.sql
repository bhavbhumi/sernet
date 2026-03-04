
-- Create support_documents table
CREATE TABLE public.support_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'General',
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL DEFAULT 'PDF',
  file_size_kb integer,
  sort_order integer DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_documents ENABLE ROW LEVEL SECURITY;

-- Public can read published documents
CREATE POLICY "Public can read published support documents"
  ON public.support_documents FOR SELECT
  USING (status = 'published');

-- Admins can manage all
CREATE POLICY "Admins can manage support documents"
  ON public.support_documents FOR ALL
  USING (is_admin(auth.uid()));

-- Create storage bucket for support documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('support-documents', 'support-documents', true, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']);

-- Storage RLS: public read
CREATE POLICY "Public can read support documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'support-documents');

-- Storage RLS: admin upload
CREATE POLICY "Admins can upload support documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'support-documents' AND (SELECT is_admin(auth.uid())));

-- Storage RLS: admin update
CREATE POLICY "Admins can update support documents"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'support-documents' AND (SELECT is_admin(auth.uid())));

-- Storage RLS: admin delete
CREATE POLICY "Admins can delete support documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'support-documents' AND (SELECT is_admin(auth.uid())));
