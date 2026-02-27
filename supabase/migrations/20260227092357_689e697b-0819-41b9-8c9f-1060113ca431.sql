
-- Add read_time column to analyses table
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS read_time text;

-- Create a function to calculate read_time from body word count
-- Average reading speed: 200 words per minute
CREATE OR REPLACE FUNCTION public.calculate_read_time()
RETURNS TRIGGER AS $$
DECLARE
  word_count integer;
  minutes integer;
BEGIN
  IF NEW.body IS NOT NULL AND length(trim(NEW.body)) > 0 THEN
    -- Count words by splitting on whitespace
    word_count := array_length(regexp_split_to_array(trim(NEW.body), '\s+'), 1);
    minutes := GREATEST(1, ROUND(word_count / 200.0));
    NEW.read_time := minutes || ' min read';
  ELSE
    NEW.read_time := '1 min read';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for articles
CREATE TRIGGER calculate_articles_read_time
BEFORE INSERT OR UPDATE OF body ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.calculate_read_time();

-- Create triggers for analyses
CREATE TRIGGER calculate_analyses_read_time
BEFORE INSERT OR UPDATE OF body ON public.analyses
FOR EACH ROW
EXECUTE FUNCTION public.calculate_read_time();

-- Create triggers for awareness
CREATE TRIGGER calculate_awareness_read_time
BEFORE INSERT OR UPDATE OF body ON public.awareness
FOR EACH ROW
EXECUTE FUNCTION public.calculate_read_time();
