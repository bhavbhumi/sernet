# Staff-ready operations: Sales → Support → Accounts

## Scope
Reshape the existing modules for practical daily staff use, completing one department before moving to the next. Defer additional features, new delivery integrations and client-portal work. Preserve the public website, existing records and current permissions keys.

## 1. Sales — first
- Keep the working path clear: handed-off enquiry → accepted enquiry → contact → product opportunity → recorded progress.
- Refine existing Leads, Contacts and Deals screens: consistent filters, readable tables, unified row actions, clear owners/statuses and usable mobile layouts.
- Remove competing creation paths: the current New Deal form can create another contact inline or leave the contact empty; use an existing contact instead.
- Align both deal-creation entry points with the existing product master and pipeline configuration rather than independent product lists.
- Repair existing ownership, activity logging, editing, stage changes and history recording; enforce configured transition requirements without claiming unsupported approval actions work.
- Check staff access at the data/action boundary, not just menu visibility. Show failed reads and saves explicitly, and keep totals aligned with the records staff can access.
- Preserve the recently verified lead acceptance, prospect-aware conversion and duplicate safeguards.

**Completion check:** signed-in staff can accept a handed-off enquiry, convert it, open/edit its contact, create its product opportunity, record activity and advance an allowed stage; saved changes and history read back correctly. Check denied actions and desktop/mobile layouts.

## 2. Support — after Sales
- Reshape existing Tickets and ticket details around assignment, classification, replies, internal notes, documents, deadlines and resolution.
- Repair initial loading, search, filters, pagination and error handling so missing or failed reads do not look like an empty queue.
- Verify existing canned responses, knowledge-base links and escalation settings; preserve separation between internal notes and customer-visible replies.
- Verify staff can create, assign, reply to, resolve and close a ticket, with accurate history and authorised customer visibility.

## 3. Accounts — after Support
- Reshape existing Invoices, Commission Claims and Partner Payouts with consistent lists, actions, statuses and references.
- Check principal/partner/client selection against existing business rules; do not invent charges, commission rates or tax treatment.
- Repair invoice totals and line-item save integrity, receipt/payment updates, claim and payout validation, and failed save/delete handling.
- Make existing financial summaries error-aware and complete; confirm records save, reopen and update correctly.
- Review existing firm, bank, service, tax and payment-term settings for working links and forms; preserve HR's payroll ownership and avoid a second payroll workflow.

## Shared implementation rules
- Use the existing design system and permission keys; no wholesale rebranding or extra modules.
- Keep sensitive actions authenticated and enforce business rules in the database or protected server actions.
- Use additive database changes only where required; preserve previously published compatibility.
- Add focused regression tests for changed rules and verify real signed-in workflows with temporary records, then remove those records.
- Report each department's completed checks and any dependency requiring management information before advancing.
- Keep publication separate from preview work; no deployment is requested by this plan.
