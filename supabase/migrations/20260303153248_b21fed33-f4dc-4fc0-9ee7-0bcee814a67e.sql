-- Deduplicate contact_branches: keep only the first inserted record per (contact_id, branch_city, address_line1)
DELETE FROM public.contact_branches
WHERE id NOT IN (
  SELECT DISTINCT ON (contact_id, branch_city, address_line1)
    id
  FROM public.contact_branches
  ORDER BY contact_id, branch_city, address_line1, created_at ASC
);