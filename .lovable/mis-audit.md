# Post-migration MIS audit

## Verified fixes
- Master Dashboard: old News/Circular data replaced by canonical `feeds` counts (labelled sources). 5 News sources and 3 Circular sources; articles 438, analysis 610, reports 5.
- Operational admin queries: refresh every minute while visible and online, on return/focus/reconnect and successful Query mutations. Static settings and costly System Health excluded.
- Content lists: stable paginated reads instead of the backend's 1,000-row cap. Posts UI verified at 1,055 published posts.
- Failed exact counts display unavailable, not zero. Failed paginated reads reject partial totals.
- Leads, attribution, activity counts, registrations, deals, invoices, payroll and attendance: paginated operational reads. Filtered lead totals explicitly labelled.
- Legacy content, support tickets and attendance reports join the shared refresh event without resetting unsaved forms.

## Verification
- Signed-in admin: manual refresh succeeds, 21 dashboard reads recur after one minute.
- Admin at 1280/889/390 widths: no page overflow; public Home, Services, Open Account, Legal and Insights at 390: no overflow or page errors.
- 24 focused tests pass; harness reports build OK.

## Remaining scope and cautions
- Employee/client/partner portal dashboards retain one-shot, intentionally capped recent-item lists. They are not complete MIS summaries; evaluate separately during portal work (client redesign parked by user).
- System Health remains on-demand with a ten-minute cache, intentionally not an always-live service monitor.
- This is bounded polling, not push/realtime. Changes in other users' sessions appear within the next visible refresh cycle.
- Four unused direct libraries removed; compiler leftovers and temporary migration test backups removed. Keep historical migrations and active email, cron, webhook integrations. Keep potentially manual-use seed and normalisation tools until ownership/use is confirmed.
- Quick security scan: no active findings. Deep review predates migration and is not a current security assurance.
- Dependency scan flags Zod 3.25.76, oversized constrained collection validation advisory, fixed in 4.6.6. No vulnerable collection validator pattern found in current server-function search; not a proof of non-exploitability. A major-version upgrade needs separate full compatibility testing.
