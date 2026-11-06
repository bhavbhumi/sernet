# Architecture rules

- The site runs on TanStack Start with server rendering; article routes build share/canonical metadata in route `loader` + `head()` from the live CMS row and its own sized cover, so new posts get correct previews on every request without a rebuild.
- Public pages set server-rendered titles/descriptions via route `head()` (`src/lib/routeHead.ts`); `SEOHead` only syncs the open document after navigation, so new public pages need both.
- Code rendered during SSR must not touch browser globals (window, localStorage, DOMParser) at render or module scope; guard them or move them into effects, otherwise the page silently falls back to client-only rendering.
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
- Sanitize CMS rich-text at each insertion boundary through the shared `sanitizeRichText` allowlist, keeping legal section processing separate; this blocks stored script execution without changing ordinary formatting.
- Keep product empanelments and commission download links within the consolidated disclosures CMS document, using uploaded asset URLs; this allows administrators to maintain verified provider information without a second data source.
- Keep public IT and HR Policy text and their matching versioned PDF links within the Policies & Procedures CMS document; exclude internal review notes and operational secrets so each policy has one maintainable public edition.
- Group policy navigation using CMS heading `data-policy-group` metadata while preserving the numbered section anchors; this keeps titles and groups editable without breaking existing policy links.
- Give each topic one CMS home: Investor Charter for investor guidance, Disclosures for registrations/remuneration/product risks/provider responsibilities, Grievance Redressal for complaint procedures, Privacy for data practices, Terms for contractual website/service terms, and Policies for IT/HR; remove duplicate sections rather than retaining placeholder summaries.
- Preserve explicit numbered CMS heading IDs when removing or reordering legal sections, and redirect retired policy anchors to their native document; this keeps existing links working without empty navigation entries.- Keep SERNET's registrations, scope and limits in `src/lib/regulatoryIdentity.ts` and show them only via `RegulatoryIdentity` (including its localized homepage trust variant); one verified source prevents conflicting ARN/scope wording across pages (including Tick Funds Global).
- Compliance and product routes prefetch the same CMS queries their pages use in route loaders, so legal text is in the server-rendered HTML without a second editable copy; legal HTML is sanitised with string-based `sanitize-html` so server and browser output match.
- "Last reviewed" dates come from `legal_pages.last_reviewed_on` or `pageReviewDates`, set only after a genuine content review; both legal CMS editors expose an explicit date input, never derive dates from deploy or edit timestamps.
- Give each product one full home page (/tickfunds, /tushil, /choicefinx); Services tabs use the short `ServiceOverview` summary and Pricing shows only charges, linking to the product page; this prevents product copy drifting across pages.

- Fit Insights listing covers without cropping in stable image frames and wrap full article titles; embedded cover text must not be cut off at any breakpoint.
- Route all prospect onboarding through `/open-account` tabs using links and copy in `src/content/onboarding.ts`; SERNET only captures interest into `leads` (`lead_type: account_opening`) while KYC and account opening stay on provider pages.
- Model additional onboarding partners as ordered sections in the shared onboarding content with explicit interest keys; callback actions select those keys in the existing enquiry form without inventing provider signup URLs.
- Admin and background backend functions must call the shared `requireAdmin` check (admin sign-in or internal admin key); database-triggered functions authenticate with a secret kept in the locked `internal_config` table; this keeps privileged tools unreachable by the public.

- Admin operational MIS refreshes through the shared mounted refresh coordinator on a bounded visible/online cycle; health diagnostics remain on-demand to avoid unnecessary traffic.
- MIS totals must use exact error-aware counts or stable paginated reads; never treat query failures as zero or derive full totals from capped lists.
- Serve `/sitemap.xml` from the server route `src/routes/sitemap[.]xml.ts` (static public paths plus paginated published articles, no lastmod); new posts appear automatically, so keep no static `public/sitemap.xml` that would shadow it.
