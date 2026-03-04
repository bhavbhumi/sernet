
-- Batch 1: Common KYC (CM-*) - Update owner_team, priority, escalation_level, SLA data
UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('CM-KYC-NF-001','CM-KYC-NF-002','CM-KYC-NF-003','CM-KYC-NF-004','CM-KYC-NF-006','CM-KYC-NF-007','CM-KYC-NF-010','CM-KYC-CMP-001','CM-KYC-NF-012','CM-KYC-NF-013','CM-KYC-NF-014');

UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'high', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code IN ('CM-KYC-NF-005','CM-KYC-NF-008','CM-KYC-NF-009','CM-KYC-NF-011','CM-KYC-NF-015','CM-KYC-NF-016','CM-KYC-NF-017');

-- Choice FinX Account & Onboarding
UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'standard', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('CF-ACC-ON-001','CF-ACC-ON-002','CF-ACC-ON-003','CF-ACC-ON-004','CF-ACC-ON-005');

UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'high', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code IN ('CF-ACC-NF-001','CF-ACC-NF-002');

UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code = 'CF-ACC-NF-003';

-- Choice FinX Orders (Financial Transactions)
UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('CF-ORD-FT-001','CF-ORD-FT-002','CF-ORD-FT-005','CF-ORD-FT-009','CF-ORD-FT-010');

UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'high', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code IN ('CF-ORD-FT-003','CF-ORD-FT-004','CF-ORD-FT-006','CF-ORD-FT-007');

UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'high', escalation_level = 4, first_response_sla_hours = 0.25, resolution_sla_hours = 4, escalation_trigger = 'Immediate if no progress in 2h; SLA breach; or suspected fraud' WHERE issue_code = 'CF-ORD-FT-008';

-- Choice FinX Transactions & Settlement
UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'high', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code = 'CF-TRN-FT-001';

UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('CF-TRN-FT-002','CF-TRN-FT-003','CF-TRN-FT-004','CF-TRN-FT-005');

-- Choice FinX Funds & Withdrawals
UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'high', escalation_level = 4, first_response_sla_hours = 0.25, resolution_sla_hours = 4, escalation_trigger = 'Immediate if no progress in 2h; SLA breach; or suspected fraud' WHERE issue_code = 'CF-FND-FT-001';

UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('CF-FND-FT-002','CF-FND-FT-003','CF-FND-FT-004','CF-FND-FT-005');

-- Choice FinX Margin, RMS & Risk
UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('CF-MAR-FT-001','CF-MAR-FT-003');

UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'high', escalation_level = 4, first_response_sla_hours = 0.25, resolution_sla_hours = 4, escalation_trigger = 'Immediate if no progress in 2h; SLA breach; or suspected fraud' WHERE issue_code IN ('CF-MAR-FT-002','CF-MAR-FT-004');

-- Choice FinX Pledge & Collateral
UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'high', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('CF-PLD-FT-001','CF-PLD-FT-002');

UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'high', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code = 'CF-PLD-FT-003';

-- Choice FinX Reports & Statements
UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'standard', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code IN ('CF-REP-REP-001','CF-REP-REP-003','CF-REP-REP-004');

UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'standard', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code = 'CF-REP-REP-002';

-- Choice FinX Charges & Fees
UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'standard', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code = 'CF-CHG-CHG-001';

UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'standard', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code IN ('CF-CHG-CHG-002','CF-CHG-CHG-003','CF-CHG-CHG-004');

-- Choice FinX Technical
UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'standard', escalation_level = 2, first_response_sla_hours = 1, resolution_sla_hours = 24, escalation_trigger = '50% SLA with no update' WHERE issue_code IN ('CF-TEC-TEC-001','CF-TEC-TEC-003','CF-TEC-TEC-004');

UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'standard', escalation_level = 2, first_response_sla_hours = 4, resolution_sla_hours = 72, escalation_trigger = 'SLA breach or customer escalation' WHERE issue_code = 'CF-TEC-TEC-002';

-- Choice FinX Security & Fraud (P0 / Critical)
UPDATE public.kb_articles SET owner_team = 'Client Servicing', priority = 'critical', escalation_level = 3, first_response_sla_hours = 0.25, resolution_sla_hours = 4, escalation_trigger = 'Immediate if no progress in 2h; SLA breach; or suspected fraud' WHERE issue_code IN ('CF-SEC-SEC-001','CF-SEC-SEC-002','CF-SEC-SEC-003');
