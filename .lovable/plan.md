# Marketing module — action plan for review

## Updated direction (9 November 2026)
**Single objective: generate leads the team can pursue.** Every Marketing tool is judged by whether it produces, enriches or hands over a lead.

### New admin menu structure
```text
Website (own group, moved out of System)
  Site Settings · Page Directory · SEO Health · Media Library
  Content Studio: Posts (Read / Watch / Listen) · Feeds (RSS) · Bulletin · Press & Media
  Resources:      Calendars (Holidays, Economic Events) · Calculators · Downloads
Marketing
  Leads Overview · Campaigns · Lead Attribution · Events & Webinars · Subscribers · Composer
Feedback (own group)
  Surveys · Reviews        (Polls retired from the menu)
System
  Master Data · Users & Access · Monitor
```
- Existing page addresses keep working; only grouping and access keys change. Permissions for current staff move with their screens.
- **Calculators** and **Downloads** become editable in Admin and drive the public pages (downloadable forms per Invest/Insure/Trade/Other tabs; calculator enquiry results feed leads). Today both are largely fixed on the website.
- Every Resource and Content page carries its matching call to action; each enquiry records which page, post, calculator or download produced it.

### Feedback: survey or review after a ticket closes?
- **Every closed ticket → a short satisfaction survey** (1–5 rating + optional comment), linked to the ticket and client. It measures service quality privately.
- **Review only by invitation**: satisfied clients (4–5) are offered the option to leave a public review, which still goes through moderation and permission to publish. Low ratings create a follow-up task for Support instead.
- **Periodic client surveys** continue on Microsoft Forms: Admin keeps the survey link, audience and dates, sends it through Composer, and records responses only if exported/imported (Microsoft results are not read automatically).
- **Polls** are hidden from Admin and the website; existing data is kept.

### Lead-focused priority order
1. Website/Feedback menu restructure with unchanged links and permissions.
2. Every public form (Open Account, Contact, calculators, downloads, newsletter, events, post CTAs) creates one attributed lead with source page, campaign and service interest.
3. Marketing Leads Overview: new, unassigned, handed to Sales, accepted — opening the filtered list.
4. Calculators and Downloads admin; ticket-close survey and review invitation.
5. Newsletter consent/controlled sending, then events.

## Objective and sequence
Make Marketing usable for SERNET's own team: prepare content, obtain approval, publish, communicate with consenting subscribers, capture attributable enquiries and hand them to Sales or Support.

Work in the agreed order: **Marketing → Sales → Support → Accounts**. Client portal development stays deferred. This plan is for your observations; no Marketing changes begin until your feedback is incorporated.

## Proposed organisation

| Area | Responsibilities |
|---|---|
| Marketing Overview | Pending approvals, incomplete drafts, newsletter outcomes, campaign enquiries and handoffs awaiting acceptance |
| Content & Media | Insights, reports, updates, awareness, covers and attachments; preserve the approved taxonomy and existing editors |
| Campaigns & Attribution | Objectives, audience, owner, dates, channels, budget, tagged links and attributable enquiries |
| Newsletters | Subscribers, consent/preferences, composer, test sends, approval and delivery history |
| Events | Investor meetings/webinars, registrations, attendance and follow-up, only when actually used |
| Reviews | Permission to publish, moderation and verified-client status |
| Website & SEO | Existing page/media/SEO tools as supporting functions, without creating duplicate content sources |

Marketing owns acquisition and communication. Sales owns qualification and opportunities. Support owns service requests and complaints. Accounts owns spend/payment verification and realised revenue. A newsletter subscriber is not automatically a client or sales enquiry.

## 1. Establish the working baseline and access
- List current screens and keep one authoritative editor/source for each content type; consolidate confusing entry points without losing links or records.
- Agree who prepares content, approves it, publishes it and sends newsletters. Permission presets remain configurable; do not assume staff assignments.
- Enforce permissions for direct links and actual actions, not just visible menus.
- Make save/send/load errors visible; record responsible user and time for important changes.
- Keep useful existing tools. Do not add AI, another CRM, or external integrations for this rollout.

**Acceptance:** authorised staff can complete their work; unauthorised users cannot publish, send, export subscribers or change approvals by bypassing menus.

## 2. Make content publishing reliable
- Use the approved Type → Category → Subcategory → Tags structure and existing Read/Watch/Listen formats consistently.
- Provide a working queue: Draft, Needs Review, Ready to Publish, Published, Archived. Reuse current statuses where sufficient; separate review readiness only where needed.
- Before publication, check required classification, cover/media loading, summary, body formatting/tables, attachments, sources, approved disclaimers and next-step links.
- Retain preview, original post dates and article-specific sharing metadata. Preserve previous wording for recovery when substantial edits are made.
- Show missing covers/classification/attachments as actionable exceptions, not misleading success counts.
- Keep existing RSS-fed updates distinct from SERNET-authored Insights; avoid duplicate publishing flows.

**Acceptance:** a prepared draft saves and reloads correctly, stays private until authorised publication, then displays the expected text, cover, links and share information. Backdated dates remain intact.

## 3. Make newsletters genuinely operational
- Verify signup, duplicate handling, preferences, unsubscribe and existing subscriber records first.
- Record consent source and time when genuinely captured; mark missing historical evidence for review rather than inventing it.
- Exclude unsubscribed, suppressed and otherwise ineligible addresses. Rejoining requires an explicit subscription action.
- Make the composer support preview → controlled test send → approval → send.
- Distinguish queued, provider-accepted, delivered, failed and bounced outcomes where the email service supplies evidence. Never label acceptance as delivery.
- Prevent accidental duplicate batches, expose failures and allow safe retry only for appropriate unsent/failed recipients.
- Keep scheduling manual unless reliable background delivery is verified; do not imply that a date field sends automatically.

**Acceptance:** a controlled test reaches only eligible recipients, unsubscribe works, failures are visible, and a repeat action cannot resend the whole batch accidentally.

## 4. Connect campaigns to enquiries and department handoffs
- Give each campaign an objective, service/product, owner, dates, audience, channel and tagged destination link.
- Carry campaign/source details from a tagged visit through the relevant enquiry forms into the existing enquiry record.
- Report enquiries and Sales-accepted/qualified outcomes separately. Activation and revenue remain unavailable until Sales/Accounts supply verified outcomes.
- Keep unattributed enquiries visible as unattributed; do not invent campaign matches.
- Route new-business enquiries to Sales; service issues/complaints to Support. Marketing can inspect handoff status without maintaining a second lead list.
- Preserve source, consent and service selections; show awaiting assignment/acceptance and failed acknowledgements.
- The later Sales phase will implement its follow-up/conversion workflow; this phase establishes the handoff and shared identifiers only.

**Acceptance:** one tagged test enquiry reaches the correct queue once, retains its campaign and service context, and appears in the correct campaign totals.

## 5. Finish lightweight events and review controls
- For events actually used, verify registration, duplicate/capacity checks where applicable, attendance updates, export and consent-based follow-up.
- Hide unused event functions rather than building a large event-management system.
- Require permission to publish a new testimonial; new manual additions should not become publicly approved by default.
- Preserve previously management-verified reviews; do not remove them or demand retrospective re-approval without evidence of a problem.

**Acceptance:** a test registration reads back in Admin; review approval controls public visibility and publication evidence is recorded.

## 6. Marketing Overview and release checks
- Show real counts for incomplete drafts, approvals, consenting subscribers, send outcomes, campaigns, registrations and unaccepted handoffs.
- Each number opens the corresponding filtered list. Failed queries show an error, not zero.
- Use the existing bounded operational refresh; SEO Health remains on page-open/manual Recheck only.
- Verify one complete journey: approved content → tagged campaign → eligible test newsletter → enquiry → correct department handoff.
- Test desktop/mobile and authorised/unauthorised roles; remove test records after verification.
- Release only after your review. No bulk email, article publication or website deployment merely from approving this plan.

## Suggested implementation batches
1. Access, navigation and content readiness.
2. Subscriber consent, composer and controlled delivery.
3. Campaign attribution and Sales/Support handoffs.
4. Lightweight events/reviews, overview and end-to-end verification.

## Draft-cover work completed alongside this plan
- Found **11 unpublished posts dated 5–8 November 2026**.
- Added **seven distinct WebP covers**: Gold/Silver, active-equity AUM, FPI flows, Rabi sowing, global-investor safety, SIP allocation and October sector review.
- Reused approved covers for **two Daily Market News posts, one Weekly Triggers and one Weekly Capsule**.
- All ten distinct image URLs load; a signed-in draft editor displayed its saved cover. Images are stored in the Media Library.
- Titles, summaries, bodies, dates, classification and draft status were not changed. Nothing was published.
- **Before publication:** all 11 still need Type classification; the Gold/Silver body also contains an unresolved original-chart placeholder. Image completion does not mean the content is fully approved or checked.

## Technical implementation notes
- Extend existing TanStack Start, shared CMS, Marketing screens and Lovable Cloud records; avoid replacement modules and duplicate sources.
- Inspect live policies and integrations before changing permissions, consent or sending behaviour. Enforce privileged actions in protected server functions and database policies, with focused tests.
- Keep attribution attached to existing leads and handoff records; count outcomes from actual recorded events, not guesses.
- Preserve the existing newsletter service, suppression history, article SSR metadata, taxonomy and original date handling.
- Add schema changes only where an existing field cannot represent the approved workflow; use additive changes and preserve prior deployments.