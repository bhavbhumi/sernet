-- Retire the CSR page. SERNET is a financial product distributor and runs no
-- corporate social responsibility programme, so the directory entry must not
-- resurface on a fresh database rebuild.
delete from public.site_pages
where path = '/csr' or lower(title) = 'csr';