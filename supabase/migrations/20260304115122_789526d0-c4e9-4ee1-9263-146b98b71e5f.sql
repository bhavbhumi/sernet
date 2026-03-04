
-- Tushil Life Insurance - Retail
UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code = 'TU-LIF-ON-001';

UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('TU-LIF-FT-001','TU-LIF-FT-002','TU-LIF-FT-004','TU-LIF-FT-005','TU-LIF-FT-008','TU-LIF-FT-009','TU-LIF-NF-003');

UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code IN ('TU-LIF-NF-001','TU-LIF-FT-003','TU-LIF-NF-002','TU-LIF-NF-004');

UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'high', escalation_level = 4, first_response_sla_hours = 0.25, resolution_sla_hours = 4, escalation_trigger = 'Immediate if no progress in 2h; SLA breach; or suspected fraud' WHERE issue_code IN ('TU-LIF-FT-006','TU-LIF-FT-007');

-- Tushil Group Term Life (GTL)
UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code = 'TU-GTL-ON-001';

UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code IN ('TU-GTL-NF-001','TU-GTL-NF-002');

UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('TU-GTL-NF-003','TU-GTL-FT-001','TU-GTL-FT-002');

UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'high', escalation_level = 4, first_response_sla_hours = 0.25, resolution_sla_hours = 4, escalation_trigger = 'Immediate if no progress in 2h; SLA breach; or suspected fraud' WHERE issue_code = 'TU-GTL-FT-003';

-- Tushil Health Insurance - Retail
UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code = 'TU-HLR-ON-001';

UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('TU-HLR-FT-001','TU-HLR-FT-002','TU-HLR-FT-004');

UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'high', escalation_level = 4, first_response_sla_hours = 0.25, resolution_sla_hours = 4, escalation_trigger = 'Immediate if no progress in 2h; SLA breach; or suspected fraud' WHERE issue_code IN ('TU-HLR-FT-003','TU-HLR-FT-005');

UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code IN ('TU-HLR-NF-001','TU-HLR-NF-002');

-- Tushil Group Health (GMC/GPA)
UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code = 'TU-GRH-ON-001';

UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code IN ('TU-GRH-NF-001','TU-GRH-NF-002');

UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('TU-GRH-NF-003','TU-GRH-FT-003');

UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'high', escalation_level = 4, first_response_sla_hours = 0.25, resolution_sla_hours = 4, escalation_trigger = 'Immediate if no progress in 2h; SLA breach; or suspected fraud' WHERE issue_code IN ('TU-GRH-FT-001','TU-GRH-FT-002');

UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code = 'TU-GRH-REP-001';

-- Tushil Professional Indemnity
UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code = 'TU-PIN-ON-001';

UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('TU-PIN-FT-001','TU-PIN-FT-002','TU-PIN-FT-003');

UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'high', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code = 'TU-PIN-NF-001';

UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'high', escalation_level = 4, first_response_sla_hours = 0.25, resolution_sla_hours = 4, escalation_trigger = 'Immediate if no progress in 2h; SLA breach; or suspected fraud' WHERE issue_code = 'TU-PIN-FT-004';

-- Tushil Security & Fraud (P0)
UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'critical', escalation_level = 3, first_response_sla_hours = 0.25, resolution_sla_hours = 4, escalation_trigger = 'Immediate if no progress in 2h; SLA breach; or suspected fraud' WHERE issue_code = 'TU-SEC-SEC-001';

UPDATE public.kb_articles SET owner_team = 'Insurance Operations', priority = 'standard', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code = 'TU-SEC-TEC-001';
