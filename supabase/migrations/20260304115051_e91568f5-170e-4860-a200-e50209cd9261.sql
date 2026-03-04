
-- Tick Funds Onboarding & Mandates
UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('TF-ONB-ON-001','TF-ONB-ON-002','TF-ONB-ON-003','TF-ONB-ON-005');

UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code = 'TF-ONB-ON-004';

UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code = 'TF-ONB-NF-001';

-- Tick Funds Mutual Funds - Financial Transactions (P1, 1h/24h)
UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('TF-MF-FT-001','TF-MF-FT-003','TF-MF-FT-005','TF-MF-FT-007','TF-MF-FT-008','TF-MF-FT-009','TF-MF-FT-010','TF-MF-FT-012','TF-MF-FT-013','TF-MF-FT-014','TF-MF-FT-015');

-- Tick Funds Mutual Funds - Financial Transactions (P1, 0.25h/4h - L4)
UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'high', escalation_level = 4, first_response_sla_hours = 0.25, resolution_sla_hours = 4, escalation_trigger = 'Immediate if no progress in 2h; SLA breach; or suspected fraud' WHERE issue_code IN ('TF-MF-FT-002','TF-MF-FT-004','TF-MF-FT-006','TF-MF-FT-016');

-- Tick Funds Mutual Funds - Financial Transactions (P1, 4h/72h)
UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code IN ('TF-MF-FT-011','TF-MF-FT-017');

-- Tick Funds Mutual Funds - Non-Financial Requests (P1, 4h/72h)
UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code IN ('TF-MF-NF-001','TF-MF-NF-002','TF-MF-NF-003','TF-MF-NF-005','TF-MF-NF-007','TF-MF-NF-009','TF-MF-NF-010','TF-MF-NF-011');

-- Tick Funds Mutual Funds - Non-Financial Requests (P1, 1h/24h)
UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('TF-MF-NF-004','TF-MF-NF-006','TF-MF-NF-008','TF-MF-NF-013','TF-MF-NF-014');

-- Tick Funds Mutual Funds - Transmission (L4)
UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'high', escalation_level = 4, first_response_sla_hours = 0.25, resolution_sla_hours = 4, escalation_trigger = 'Immediate if no progress in 2h; SLA breach; or suspected fraud' WHERE issue_code = 'TF-MF-NF-012';

-- Tick Funds Mutual Funds - Compliance
UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code = 'TF-MF-CMP-001';

-- Tick Funds Mutual Funds - Reports (P2)
UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code IN ('TF-MF-REP-001','TF-MF-REP-002');

UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code = 'TF-MF-REP-003';

-- Tick Funds Mutual Funds - Charges (P2)
UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code IN ('TF-MF-CHG-001','TF-MF-CHG-002');

-- Tick Funds Digital Gold & Silver
UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('TF-DGS-ON-001','TF-DGS-TEC-001');

UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('TF-DGS-FT-001','TF-DGS-FT-002','TF-DGS-FT-004');

UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code IN ('TF-DGS-FT-003','TF-DGS-FT-005');

UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code = 'TF-DGS-REP-001';

-- Tick Funds Fixed Deposits
UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code = 'TF-FD-ON-001';

UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('TF-FD-FT-001','TF-FD-FT-003','TF-FD-FT-005');

UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'high', escalation_level = 4, first_response_sla_hours = 0.25, resolution_sla_hours = 4, escalation_trigger = 'Immediate if no progress in 2h; SLA breach; or suspected fraud' WHERE issue_code = 'TF-FD-FT-002';

UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code IN ('TF-FD-FT-004','TF-FD-NF-001');

UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code = 'TF-FD-NF-002';

UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code = 'TF-FD-REP-001';

-- Tick Funds Bonds
UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code = 'TF-BND-ON-001';

UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('TF-BND-FT-001','TF-BND-FT-002','TF-BND-FT-003','TF-BND-FT-004');

UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'high', escalation_level = 4, first_response_sla_hours = 0.25, resolution_sla_hours = 4, escalation_trigger = 'Immediate if no progress in 2h; SLA breach; or suspected fraud' WHERE issue_code = 'TF-BND-FT-005';

UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code IN ('TF-BND-REP-001','TF-BND-CHG-001');

-- Tick Funds Security & Fraud (P0)
UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'critical', escalation_level = 3, first_response_sla_hours = 0.25, resolution_sla_hours = 4, escalation_trigger = 'Immediate if no progress in 2h; SLA breach; or suspected fraud' WHERE issue_code = 'TF-SEC-SEC-001';

UPDATE public.kb_articles SET owner_team = 'Mutual Fund Operations', priority = 'critical', escalation_level = 3, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code = 'TF-SEC-SEC-002';
