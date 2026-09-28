-- Likes: remove open read/delete, expose via RPCs
DROP POLICY IF EXISTS "Public can unlike own" ON public.article_likes;
DROP POLICY IF EXISTS "Public can read like counts" ON public.article_likes;
DROP POLICY IF EXISTS "Public can unlike own poll" ON public.poll_likes;
DROP POLICY IF EXISTS "Public can read poll likes" ON public.poll_likes;
DROP POLICY IF EXISTS "Public can unlike own survey" ON public.survey_likes;
DROP POLICY IF EXISTS "Public can read survey likes" ON public.survey_likes;
CREATE POLICY "Admins read article likes" ON public.article_likes FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins read poll likes" ON public.poll_likes FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins read survey likes" ON public.survey_likes FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.get_like_state(_kind text, _target uuid, _fp text)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE c int; l boolean;
BEGIN
  IF _kind = 'article' THEN
    SELECT count(*), coalesce(bool_or(fingerprint = _fp), false) INTO c, l FROM article_likes WHERE article_id = _target;
  ELSIF _kind = 'poll' THEN
    SELECT count(*), coalesce(bool_or(fingerprint = _fp), false) INTO c, l FROM poll_likes WHERE poll_id = _target;
  ELSIF _kind = 'survey' THEN
    SELECT count(*), coalesce(bool_or(fingerprint = _fp), false) INTO c, l FROM survey_likes WHERE survey_id = _target;
  ELSE RAISE EXCEPTION 'invalid kind';
  END IF;
  RETURN jsonb_build_object('count', c, 'liked', l);
END $$;

CREATE OR REPLACE FUNCTION public.remove_like(_kind text, _target uuid, _fp text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _fp IS NULL OR length(_fp) < 8 THEN RAISE EXCEPTION 'invalid fingerprint'; END IF;
  IF _kind = 'article' THEN DELETE FROM article_likes WHERE article_id = _target AND fingerprint = _fp;
  ELSIF _kind = 'poll' THEN DELETE FROM poll_likes WHERE poll_id = _target AND fingerprint = _fp;
  ELSIF _kind = 'survey' THEN DELETE FROM survey_likes WHERE survey_id = _target AND fingerprint = _fp;
  ELSE RAISE EXCEPTION 'invalid kind';
  END IF;
END $$;
GRANT EXECUTE ON FUNCTION public.get_like_state(text, uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.remove_like(text, uuid, text) TO anon, authenticated;

-- Poll votes: hide fingerprints, expose aggregates
DROP POLICY IF EXISTS "Public can read poll votes" ON public.poll_votes;
DROP POLICY IF EXISTS "Public can read vote counts" ON public.poll_votes;
CREATE OR REPLACE FUNCTION public.get_poll_results(_poll uuid, _fp text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'counts', coalesce((SELECT jsonb_object_agg(option_id, n) FROM (SELECT option_id, count(*) n FROM poll_votes WHERE poll_id = _poll GROUP BY option_id) s), '{}'::jsonb),
    'total', (SELECT count(*) FROM poll_votes WHERE poll_id = _poll),
    'my_vote', (SELECT option_id FROM poll_votes WHERE poll_id = _poll AND voter_fingerprint = _fp LIMIT 1)
  )
$$;
GRANT EXECUTE ON FUNCTION public.get_poll_results(uuid, text) TO anon, authenticated;

-- Newsletter: remove open update; subscribe via RPC
DROP POLICY IF EXISTS "Public can resubscribe" ON public.newsletter_subscribers;
CREATE OR REPLACE FUNCTION public.subscribe_newsletter(_first_name text, _last_name text, _email text, _preferences jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _first_name IS NULL OR length(trim(_first_name)) = 0 OR length(_first_name) > 100 OR length(coalesce(_last_name,'')) > 100 OR length(_email) > 255 THEN
    RAISE EXCEPTION 'Invalid input';
  END IF;
  INSERT INTO newsletter_subscribers (first_name, last_name, email, preferences, status, subscribed_at, unsubscribed_at)
  VALUES (trim(_first_name), nullif(trim(coalesce(_last_name,'')),''), _email, coalesce(_preferences,'[]'::jsonb), 'active', now(), NULL)
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name,
    preferences = EXCLUDED.preferences, status = 'active', subscribed_at = now(), unsubscribed_at = NULL;
END $$;
GRANT EXECUTE ON FUNCTION public.subscribe_newsletter(text, text, text, jsonb) TO anon, authenticated;

-- CRM contact details: admin only
DROP POLICY IF EXISTS "Public can read principal branches" ON public.contact_branches;
DROP POLICY IF EXISTS "Public can read KMP" ON public.contact_kmp;

-- HR config: employees and admins only
DROP POLICY IF EXISTS "Authenticated can read attendance policies" ON public.attendance_policies;
CREATE POLICY "Employees read attendance policies" ON public.attendance_policies FOR SELECT TO authenticated
  USING (public.get_employee_id_for_user(auth.uid()) IS NOT NULL OR public.is_admin(auth.uid()));
DROP POLICY IF EXISTS "Employees can read department shifts" ON public.department_shifts;
CREATE POLICY "Employees read department shifts" ON public.department_shifts FOR SELECT TO authenticated
  USING (public.get_employee_id_for_user(auth.uid()) IS NOT NULL OR public.is_admin(auth.uid()));

-- CRM pipeline config: admins only
DROP POLICY IF EXISTS "Authenticated can read pipeline stages" ON public.pipeline_stages;
CREATE POLICY "Admins read pipeline stages" ON public.pipeline_stages FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
DROP POLICY IF EXISTS "Authenticated can read pipeline sub-statuses" ON public.pipeline_sub_statuses;
CREATE POLICY "Admins read pipeline sub-statuses" ON public.pipeline_sub_statuses FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- Resume uploads: restrict to top-level document files
DROP POLICY IF EXISTS "Anyone can upload resumes" ON storage.objects;
CREATE POLICY "Anyone can upload resumes" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'cms-resumes' AND position('/' in name) = 0 AND lower(name) ~ '\.(pdf|doc|docx)$');