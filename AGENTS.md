# Architecture rules

- Prerender published article sharing metadata from paginated CMS rows at build time; share and canonical URLs use the registered article route and its own sized cover, so crawlers need no JavaScript.
- Keep article media/sidebar independent of heading count with a tablet/desktop two-column layout; short articles must not switch to full-width cover images.

- Recover collapsed single-column article layout imports in the shared body normalizer used by both content and topic indexes; preserve numeric strings rather than guessing lost table cells.

- Scope presentation motion to the public Layout and honor reduced-motion preferences through MotionConfig and CSS; administrative tools remain unaffected.
- Keep public surface washes and layered card elevation in shared theme tokens with opt-in presentation hooks; this preserves theme consistency without restyling administrative tools.
- Scope public dark-mode token refinements to `.dark .public-site`; inherited semantic tokens keep public pages consistent while preserving the administrative palette and light theme.

- Keep family-practice history and company incorporation in `src/lib/companyHistory.ts`, with locale date interpolation and metadata using the distinct incorporation date; this prevents age and origin claims drifting between pages.
- Use the CMS-backed About Press tab as the single public home for coverage, redirecting `/media` there; this preserves real article links without maintaining a second hardcoded list.

- Keep calculators deterministic and form-based, with locally generated proposals and no calculator AI services; this preserves useful planning tools without AI usage costs or chat dependencies.

- Keep Legal & Compliance documents in the existing `legal_pages` CMS, with shared navigation metadata in `src/lib/legalConfig.ts`; this keeps public and administrative sections aligned without duplicating legal documents.
- Redirect legacy legal URLs to the corresponding unified `/legal?tab=` section, while keeping Investor Charter standalone; this prevents conflicting copies while preserving existing links.
- Render CMS legal HTML through the shared sanitized `LegalDocument` with generated section anchors; this preserves readable content while blocking executable HTML and keeping section navigation stable.
- Keep product empanelments and commission download links within the consolidated disclosures CMS document, using uploaded asset URLs; this allows administrators to maintain verified provider information without a second data source.
- Keep public IT and HR Policy text and their matching versioned PDF links within the Policies & Procedures CMS document; exclude internal review notes and operational secrets so each policy has one maintainable public edition.
- Group policy navigation using CMS heading `data-policy-group` metadata while preserving the numbered section anchors; this keeps titles and groups editable without breaking existing policy links.
- Give each topic one CMS home: Investor Charter for investor guidance, Disclosures for registrations/remuneration/product risks/provider responsibilities, Grievance Redressal for complaint procedures, Privacy for data practices, Terms for contractual website/service terms, and Policies for IT/HR; remove duplicate sections rather than retaining placeholder summaries.
- Preserve explicit numbered CMS heading IDs when removing or reordering legal sections, and redirect retired policy anchors to their native document; this keeps existing links working without empty navigation entries.- Keep SERNET's registrations, scope and limits in `src/lib/regulatoryIdentity.ts` and show them only via `RegulatoryIdentity` (including its localized homepage trust variant); one verified source prevents conflicting ARN/scope wording across pages (including Tick Funds Global).
- Prerender compliance and product pages at build time (`prerender/legalPrerender.ts`) from the same CMS rows and shared content modules (`src/content/*`) the React pages use; crawlers get real text without a second editable copy. New compliance/product pages must be added there.
- "Last reviewed" dates come from `legal_pages.last_reviewed_on` or `pageReviewDates`, set only after a genuine content review; both legal CMS editors expose an explicit date input, never derive dates from deploy or edit timestamps.
- Give each product one full home page (/tickfunds, /tushil, /choicefinx); Services tabs use the short `ServiceOverview` summary and Pricing shows only charges, linking to the product page; this prevents product copy drifting across pages.

- Fit Insights listing covers without cropping in stable image frames and wrap full article titles; embedded cover text must not be cut off at any breakpoint.
- Route all prospect onboarding through `/open-account` tabs using links and copy in `src/content/onboarding.ts`; SERNET only captures interest into `leads` (`lead_type: account_opening`) while KYC and account opening stay on provider pages.
