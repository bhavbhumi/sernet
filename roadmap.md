# Roadmap
- [x] Marketing corrections: flattened menu retaining shared access key; Attribution reads saved channel/campaign; normalized promotion preferences; evidence/audit guards for lead handoffs and subscriber activation; unsubscribe timestamps and recipient suppression verified. Existing-address public signup stays protected and now states preferences are unchanged; changes/reactivation/unsubscribe use the subscribed-address support mailbox and staff editor (no unverified anonymous upsert). Nineteen tests pass; signed-in subscription lifecycle and actual form creation/readback checked, temporary entries removed, 905px menu has no overflow; preview build OK. No automatic sending or self-service email verification added.
- [x] Approved Marketing structure: Dashboard; shared Leads list/details and guarded qualification-to-Sales handoff; ten campaign types and saved UTM/QR links; manual Insights distribution; six event types with registration/attendance; Newsletter Composer/Subscribers. Signed-in link/distribution saves, handoff acceptance and attendance checked; 13 tests pass; synthetic test records removed. Preview only.
- [ ] External automatic posting and newsletter/SMS/WhatsApp delivery — waiting for approved service connections; manual preparation and recording remain available.
- [x] Publish the 11 covered drafts with Type/Category set and original dates; three missing Gold/Silver chart placeholders removed. Live article share title/cover verified on two posts.
- [x] Marketing batch 1: Website group (Site, Content Studio, Resources incl. Calculators and editable Downloads), Feedback group (Surveys with Microsoft Forms link, Service Ratings, Reviews; Polls hidden from admin and website), Leads Overview, campaign/source tracking on all six enquiry forms, ticket-close 1–5 rating with review invitation, manual reviews now wait for approval. Tagged test enquiry verified end-to-end and removed; 16 tests pass; build OK. Preview only.
- [x] Newsletter composer: draft → needs review → approved → download eligible active-subscriber list → record as sent (locked, recipient count kept); no automatic email (bulk sending not available through site email).
- [x] Marketing Overview: Action needed counts (drafts not ready/ready, newsletters in review/approved, subscribers, campaigns, low ratings, pending reviews) each linking to its list, plus missing-item draft checklist.
- [ ] Events: manage registrations/attendance now; a public event-signup page awaits the first event's approved details.
- [x] Prepare Marketing action plan for user observations; implementation awaits feedback. Then take Sales, Support and Accounts in that order; client portal remains deferred.
- [x] Cover all 11 Insights drafts (5–8 November): seven unique optimized WebP images and four approved series-cover mappings. All ten distinct URLs return 200; signed-in draft editor displays loaded cover. No wording, dates, classification or publication status changed.
- [x] Review and publish the 11 draft posts: Type classification completed and unresolved Gold/Silver chart placeholders removed before publication.
- [ ] Add 2027 market holidays — awaiting official NSE/BSE/MCX schedules: checked 7 November 2026, latest schedules found are 2026. Website already offers 2027; verified it currently has no records. Do not publish projected festival dates as exchange holidays.
- [x] Remove Corporate Events public tab, admin page/navigation, route and all eight translated labels; mark unused database table deprecated (retained only for earlier deployments). Public economic list still shows 110 events; signed-in admin listing verified, mobile has no overflow/page errors, three CMS tests pass and build OK. Preview changes require publication.
- [x] Repair calendar/subscriber admin query columns, calendar saves/status changes, searchable fields and date displays; remove public sample fallbacks and show errors explicitly. Seven tests pass; public view matches 30 holidays for 2026, 110 economic events and zero corporate rows. Newsletter signup repaired and verified through UI plus stored preferences; test entry removed and original two subscribers retained. Preview changes require publication.
- [ ] Signed-in verification of calendar saves and subscriber admin listing — preview session could not be minted for requester; requires owner to sign in in preview.
- [x] Update economic calendar figures as of 7 November 2026: 92 released actuals, 101 previous readings and 44 published calendar forecasts across 110 retained rows; corrected corroborated release dates, documented reporting periods/units/sources, excluded model forecasts and future actuals. Signed-in admin and public November Services PMI matched (55.2 / 56.2 / 55.8), three CMS tests passed. Admin value columns added in preview; data is shared with published site.
- [ ] Complete unverified calendar publication dates (some GST releases and remaining future placeholders) and consensus gaps when source evidence is available; actuals for future releases intentionally blank, four non-numeric report/budget rows have no applicable numeric figures. No automatic update service added.

- [x] Homepage CTA reworded: heading "Prosper with SERNET", subtitle now names the registered-distributor role, button reads "Open Account" to match the header — all eight locales updated (button label reused from each locale's existing header wording). English and Hindi checked on screen; button label unclipped, no page errors. Preview only, not published.
- [x] Open Account interests trimmed: Tax Planning content and checkbox removed (no partner), PMS and AIF merged into one "PMS / AIF" checkbox, Bonds checkbox removed (Altifi keeps its own signup steps). Seven tests passed; phone/desktop checkbox list and Other Services sections checked, no overflow. Preview only.


- [x] Extend Open Account with Altifi below Tick Funds, PMS/AIF callback sections, Other Services and notarisation interest; five tests passed, real enquiry saved correct service selections and test entry removed, phone layout checked. Preview only.
- [ ] Add direct PMS/AIF onboarding links — awaiting links from management; callback sections available meanwhile.

- [x] Execute approved Insights reorganisation — 1,020-post mapping applied, filters/breadcrumbs/CTAs/disclaimers and Admin fields rebuilt, taxonomy workbook used, and the batch published; disclaimer wording approved 6 November 2026. Remaining gaps tracked separately (Credit/Monthly editions, third-party research permission).

- [x] Revise plan to Type → Category → Subcategory + Tags only; live-screen 1,020 posts and verify a real IPO page. 73 IPO CTAs contain identity/links, not risk notes; third-party research restrictions and contextual disclaimer gaps flagged for approval. No CMS/site/publication changes; monthly reports and research permissions await genuine sources/confirmation.

- [x] Reconcile market series and cover assignments from all 1,020 live posts; revised plan includes 129 daily updates, 33 weekly-impact posts and 27 weekly triggers. Monthly-labelled report lacks substantive content/genuine PDF; monthly mapping awaits source confirmation. No article/image/publication changes.

- [x] Review Insights Posts organisation and propose six-topic taxonomy, classification audit, contextual CTA rules, listing/detail presentation and SEO migration safeguards; planning only. Website/content changes require approval of the plan; PRIM operational availability still needs official verification.

- [x] Fit complete Insights listing covers and wrap full titles across Articles, Analysis and Awareness; source images/content preserved. Articles verified at 1280/889/390/320px: 12 loaded covers, unclipped titles, no horizontal overflow or page errors, article navigation works; build clean. Preview only.

- [x] Keep article image/topic index left and details right on tablet/desktop, independently of heading count. Verified loaded covers at 1280/889/390px with no overflow or page errors.
- [x] Add article-specific initial HTML sharing metadata from published CMS rows and verify preview metadata. Generated 1,020 HTML pages in isolated validation; correct article title/image/canonical verified; eight focused tests passed. Requires publishing for live WhatsApp previews; existing WhatsApp cards may retain previously fetched details.

- [x] Restore readable sections and topic indexes for 51 collapsed single-column article imports through the shared renderer; preserve original content, dates, images and valid tables. Reference and affected pages checked, five recovery tests passed.
- [x] Restore the 51 legacy article bodies from matching HRBV DATA SENSE 103–153 Word originals; headings, paragraphs, bullets and intact tables restored. All 51 rendered tables and Topic Index targets verified, live reference checked, 950/390px overflow checks passed. Titles, dates, covers, categories and links unchanged; existing automatic reading-time and real update-timestamp triggers retained. Safety copy retained in private document metadata; no temporary database helper enabled.

- [x] Replace Mirae Disclosures empanelment download with the supplied logo-bearing letter; 28 January 2008 and existing brokerage preserved, preview row visually checked and public PDF download verified (200). Older asset retained for previous publications.

- [x] Refine public dark-mode contrast, neutral charcoal surfaces, clearer card borders/elevation and restrained washes; light mode, headings/spacing and administrative palette preserved. Verified theme switching, homepage/CTA, Pricing, Services and Legal at desktop and narrow widths: no overflow or page errors, consultation link intact, preview build clean. Not published.

- [x] Review item 3 hero/CTA coverage and update item 4 homepage trust strip; testimonial cards unchanged. Registration drawn from shared identity, practice years calculated from October 1986, localized retention message updated. Checked at 1280/889/390px with no overflow or page errors; consultation link works and anniversary tests pass. Item 3 inner-page actions remain suggestions only; not published.

- [x] Refine homepage washes: white hero restored with a signature gradient accent in logo order (gold, blue, red, green, soft pale separations to avoid muddy blends); account CTA wash contained within content width. Inner-page tab underlines stay plain blue by choice. Preview checked at 1280/889/390px: no overflow or page errors, signup link intact, build clean. Not published.

- [x] Preview item 2: subtle hero/CTA gradient washes, layered card elevation and 6px corners; desktop/889px/mobile and light/dark checked, no overflow or page errors, hover lift and consultation link verified; build clean. Not published.

- [x] Add subtle public-site motion, hero parallax, card hover feedback and navigation underlines; desktop hover, menu navigation and reduced-motion verified; keep decorative overflow within the public content area. Preview only, not published.

- [x] Remove calculator-only AI controls, callbacks and services; preserve calculations and enquiry/proposal forms — six calculators, saved enquiry, printable proposal and 889/390px layouts verified with no AI calls.

- [x] Verify and restore public client/partner signup without changing email confirmation — hosted settings verified, real signup returned 200 and displayed Verify Your Email.
- [x] Add editable review dates to both legal CMS editors — signed-in save/reload and public display verified using existing genuine dates, no dates invented; editor changes await publish.

- [x] Add Invesco India and Mirae Asset MF brokerage structures (1 October–31 December 2026) alphabetically in Disclosures — Mirae row notes its document also covers Platinum SIF; both empanelments await provider confirmation; rows and PDF downloads verified on preview.

- [x] Update Alchemy empanelment to 23 September 2026 per provider email — verified on preview and live. Rechecked Quant's original PDF: pages 1 and 2 explicitly state 1–31 October 2026; existing period retained pending a revised quarterly document.

- [x] Add Nippon India MF 1 October–31 December 2026 brokerage structure from the supplied PDF; empanelment (19 June 2006, redacted letter) unchanged; row and PDF download verified on preview.

- [x] Replace DSP empanelment download with the supplied branded letter (same 10 February 2006 confirmation, with DSP logo); old asset removed, new PDF verified on preview.

- [x] Update DSP empanelment to 10 February 2006 with the supplied letter and add Quant MF alphabetically with its 1–31 October 2026 brokerage schedule; Quant empanelment pending, other details preserved, rows and both PDF downloads verified on preview and live.

- [x] Update Bandhan MF empanelment to 25 April 2006 with the supplied 15 October 2026 confirmation letter; row and public PDF download verified on preview and live, brokerage details unchanged.

- [x] Add HDFC MF October–December 2026 brokerage document alphabetically in Disclosures, with standard description and empanelment awaiting confirmation; row, alphabetical ordering and public PDF download verified on preview and live.

- [x] Verify and add Kotak empanelment date and public letter — corrected letter confirms 24 May 2006; date and PDF download verified on preview and live. Brokerage remains 1–31 October 2026.

- [x] Add verified Aditya Birla Sun Life and Nippon India empanelments; historical Birla July–September 2026 rate card linked, current Birla/Nippon brokerage pending; letters redacted and all three PDFs verified on preview and live.

- [x] Trim the PPFAS brokerage structure description in Disclosures to one short line pointing to the October 2026 document — other provider rows and downloads unchanged

- [x] Independently compare Investor Charter and Legal & Compliance with industry/official distributor standards — clarified MF/PMS review responsibilities and AMC-led DDQ scope, strengthened suitability/privacy/complaint safeguards and submitted-content ownership; all six documents verified in preview and live without runtime errors; approved IT/HR and provider table fingerprints unchanged. Operational DDQ applicability and service response standards still require internal confirmation; review is not legal certification.

- [x] Research comparable distributor websites and strengthen SERNET Terms & Conditions without duplicating other legal pages — Pinaki/NJ/Prudent reviewed; 13 sections, existing anchors and complaint navigation verified in preview and on sernetindia.com

- [x] Add ICICI Prudential MF empanelment since 4 August 2006, confirmation letter and awaiting-current-brokerage placeholder; table verified and hosted PDF returns 200

- [x] Remove duplicate topics across Investor Charter and Legal pages; Investor Charter owns guidance, Legal owns contractual/privacy/disclosure/complaint/IT/HR content; approved IT/HR text and PDFs preserved, retired policy/charter links verified in preview

- [x] Prepare HR Policy review draft for Sales and Operations covering recruitment, appraisal, retention and exit — PDF and editable draft prepared; seven pages visually checked
- [x] Publish approved HR Policy text and PDF under Policies & Procedures — version 1.0 effective 12 October 2026; text, PDF and section link verified
- [x] Review existing policies and consolidate their titles into clear groups without changing approved obligations — Distribution & Investor Services; Conduct & Investor Protection; Technology & Information Security; People & Workplace
- [x] Reorganise Legal & Compliance and footer disclosures around verified AMFI/APMI distributor registrations — all six sections, legacy links and investor guidance checked
- [ ] Supply remaining provider/product commission schedules and approve legal wording with SERNET compliance reviewer — Bandhan empanelment confirmation received; remaining documents and legal approval depend on providers and the reviewer
- [x] Publish public organisation chart on About → Team tab, driven from HR employees (is_public) — 7 leadership roles per Bhavesh's structure
- [x] Consolidate Disclosures into separate sections and add verified DSP/SBI commission downloads; navigation and hosted PDF contents checked
- [x] Prepare original SERNET IT Policy review pack — PDF and editable draft; all seven pages visually checked
- [x] Publish approved IT Policy text and matching PDF under Policies & Procedures — version 1.0 effective 12 October 2026; public text, navigation and PDF download verified; all six PDF pages checked

- [x] Cloudflare DNS access restored via new token
- [x] www.sernetindia.com A record corrected to 185.158.133.1
- [x] Nameservers switched at GoDaddy to Cloudflare (nico/teagan) — verified live
- [x] notify.sernetindia.com NS delegation re-added in Cloudflare (ns3/ns4.lovable.cloud) — resolving
- [x] Test email sent to bhavesh@sernetindia.com from notify.sernetindia.com — delivered (2026-09-11); fixed broken legacy email function first
- [x] Cloudflare insights reviewed against live settings — report is a stale 2026-09-08 snapshot
- [x] DMARC corrected to quarantine policy; awaiting Cloudflare rescan
- [x] support.sernetindia.com and autodiscover.sernetindia.com restored to DNS-only after proxy checks failed
- [x] Security contact file added; publish required before Cloudflare can detect it
- [x] Added missing www domain verification record — publicly verified; activation recovery pending
- [x] Cloudflare account MFA enabled by owner; Bot Fight Mode deliberately left off (owner decision)

- [x] Publish approved Investor Charter v1.0 with corrected Support → Complaint escalation; replace duplicate investor guidance in Policies with section links; both live pages and KYC deep link verified; IT/HR text and anchors unchanged

- [x] Add Nine Alps (AIF — Opportunity Fund) row to Disclosures from the supplied 21 October 2024 referral MoU — 1% referral fee on referred contributions; row, alphabetical position (before Northern Arc) and PDF download verified on preview and live.

- [x] Link HDFC MF appointment letter (dated 15 Oct 2026, no start date stated) and add UTI MF row (empanelled since 6 July 2006, letter dated 15 Oct 2026; brokerage awaiting provider).

- [x] Update PGIM India MF empanelment to 22 September 2010 with the supplied letter dated 15 October 2026; brokerage unchanged (1 Oct–31 Dec 2026).
- [x] Compliance gaps: ARN fix, unproven figures removed, distributor wording, platform map, Tick Funds redirects, Media item marked historical
- [x] Prerendered legal, charter, disclosures, grievance and Tick Funds pages; central regulatory identity; Last reviewed dates; verified review badges; claims register
- [x] Claims corrected per management (2,500+ clients, 500+ families, 10+ employees, regular MF zero fees, 10+ insurers via partner, 1,000+ policyholders, CSR retired)
- [x] CSR removed everywhere: site_pages row deleted (plus retire_csr_page migration so a rebuild stays clean), sitemap entry dropped, CSR strings removed from all 8 locale files, Tushil FAQ "CSR" reworded to "claim settlement ratios"; /csr kept only as a redirect to /about so old links don't break. Verified in preview: no CSR text or links on home/About, sitemap clean, no page errors.
- [x] Tick Funds now says 40+ AMCs (Disclosures lists only documented providers); Pricing shows Choice FinX brokerage as Choice Equity Broking's (0.30% delivery, 0.03% intraday both legs) — verified and published.
- [x] Three Choice FinX client reviews confirmed real by management and tagged "Verified client"; sample fallback testimonials removed.

- [x] Implement approved family-history/recognition plan — confirmed 1986/1987/1994/10 March 2004 timeline, central dates and anniversary tests, all eight locale summaries and metadata corrected; six demo awards removed, original 2016 keepsake enlarged; `/media` redirects to CMS Press, placeholder downloads removed; desktop/mobile verified without page errors or overflow. Publishing pending.
- [ ] Add further office recognition records — awaits readable photographs and exact certificate/trophy inscriptions from management; 2016 personal award title remains unknown.
- [x] Audit items 6 (Estate Planning stats: 500+ wills, 50+ trusts, confidential stat) and 8 (sales +91 92067 67670, support +91 77070 22020 everywhere) — done and verified.
- [x] Unique cover images for every article before bulk publish — all categories covered (IPO Basket 73/73, Investment 81/81, Fundamentals 31/31, Trading 17/17, Markets 11, Personal Finance 1, Market Basics 1); Market Wrap, Macro and Market Outlook keep shared series covers. All 1,020 articles published, zero drafts, verified live.

## Insights reorganisation — done and live
- [x] `post_type` + `tags` columns on articles, recorded durably in `drizzle/migrations/0002_add_article_taxonomy_fields.sql`; generated types refreshed.
- [x] Approved mapping applied to all 1,020 articles (26 batches + 7-row fix; verified 0 unmapped).
- [x] Insights page rebuilt: All Posts + 6 Types + Bulletin, category → subcategory chips, tag click, title search, URL-driven filters, pagination; covers shown uncropped.
- [x] Admin post editor exposes Type and Tags (legacy kind/media kept internal).
- [x] Article and Analysis pages: Home › Insights › Type › Category trail, contextual next-step CTA and short disclaimer per type; IPO posts keep the approved Choice FinX section only.
- [x] Weekly Market Impact and Weekly Market Triggers got their own signature covers (52 posts re-pointed; 8 already-unique untouched).
- [x] Published and verified live on sernetindia.com: tabs, filters, breadcrumb, disclaimer, CTA, both new covers serving, article share preview carries its own title/image, no page errors or phone overflow.
- [x] 16 new drafts published (3 IPOs, 4 Daily Market News Updates, Weekly Capsule, Triggers Weekly, 5 Macro/Economy, MF Flows Sept-26, Swiggy) — all had covers, bodies and correct Type/Category; display dates preserved (midnight IST of item date); live Insights listing shows all of them. Share-preview HTML for the new pages awaits the in-progress deployment.
- [x] Disclaimer wording and next-step link targets approved by management on 6 November 2026 ("All six are fine") — six type disclaimers and their six button targets in `src/components/insights/PostContext.tsx` are now signed off; IPO posts keep the earlier approved Choice FinX section.
- [x] Five Credit articles published with covers; Indistock HDFC report credited (owner confirmed permission).
- [x] Six Monthly Market Review editions (May–Oct 2026, dated 1 Jun–1 Nov) published with series cover
- [ ] First forward-looking Monthly Market Outlook due 1 Dec 2026 (add October AMFI data after ~10 Nov)

- [x] Open Account page: hero + Invest/Insure/Trade/CKYC tabs, KYC useful links, Express Your Interest form to Admin leads

- [ ] Client portal (Profile, Risk Profile, Suitability, Review, Tickets) — five-tab plan written and saved; parked by user, resuming 7 November 2026

## Post-migration verification and MIS
- [x] Check public/admin layouts across desktop/tablet/mobile with authenticated dashboard verification — no horizontal overflow or page errors; automatic and manual dashboard refresh verified.
- [x] Correct main-dashboard source counts and add bounded refresh for admin operational queries, content lists, tickets and attendance reports; remove row caps from content, leads, attribution, registrations, CRM deals, invoices, payroll and attendance. Content verified at 1,055 records, with 21 automatic dashboard reads after one minute. Health remains on-demand. Employee/client/partner portal changes stay outside this admin update and client portal redesign remains parked.
- [x] Remove four unused direct libraries, obsolete compiler caches and migration test backups. Preserve potentially manual-use seed/normalisation utilities and active email/cron/webhook integrations until use is confirmed.
- [x] Run focused tests/security checks and request publication of verified changes — deployment requested for sernetindia.com; completion not yet verified. 24 focused tests passed, build OK, quick security check has no active findings. Dependency advisory detected in Zod; major-version remediation needs compatibility testing, not an untested upgrade during migration publication.
- [x] Fix four critical stored-XSS findings in newsletter/support rich-text previews using a shared HTML sanitizer; also secure adjacent support rich-text fields. Eight focused sanitizer/legal tests and the production build pass; findings marked fixed, not published.
- [x] Diwali celebration touch (8 Nov 2026): one-time gold sparkle glow on homepage load (fades after ~3s or on first scroll, skipped for reduced-motion) plus slim "Shubh Deepavali" banner; verified on desktop and mobile. Seasonal — retire by removing DiwaliBanner/DiwaliGlow from src/pages/Index.tsx after Diwali week. Not yet published.

- [x] Approved shared Marketing–Sales corrections: default Sales queue; atomic prospect-aware conversion/contact matching; assigned-owner/Sales-supervisor acceptance; preserve accepted handoffs; pre-conversion activities/due dates; explicit Event/Newsletter enquiry actions with existing-enquiry matching; canonical calculator reporting. Nineteen tests pass; signed-in creation → activity → handoff → acceptance → conversion/readback verified, repeated conversion reuses one contact, unqualified conversion blocked and referral prospect confirmed. Newsletter enquiry leaves subscription unchanged; mobile has no overflow/page errors; verification records removed. Database safeguards are live; interface updates require publication.

- [ ] Staff operational baseline, in order: Sales → Support → Accounts. Reshape existing screens, repair saves/permissions/workflow integrity and verify signed-in daily work before advancing; feature additions deferred.

- [x] Sales baseline first pass: unified existing-contact/master-product opportunity creation; editable product/owner/value/probability/close date; database-guarded stage changes with atomic history; repaired activity completion/due dates, readable contact names/type filter/import control, shared lead counts/handoff labels/actions and mobile containment. Signed-in administrator contact → deal → edit ₹60,000 → activity/complete → qualified/history checked; negative values and invalid transitions blocked; 28 tests pass and preview build OK. Test records removed; no publication.
- [x] Sales acceptance checkpoint (11 Nov 2026): restricted staff (Sales CRM only) can add contacts and is blocked from Marketing and pipeline changes; pipeline settings now view-only for non-supervisors; contact import column-shift bug fixed, bad rows rejected individually; test records removed. Next: Support (move Service Ratings under Support, Surveys & Reviews to Marketing). Original: verify restricted Sales staff permissions and actual CSV import/pipeline-settings save paths (contact edit/readback and both entry screens verified) before declaring the entire department staff-ready; then proceed to Support, then Accounts.

- [x] Support step 1: Feedback section removed; Surveys & Reviews under Marketing, Service Ratings under Support (own permission). Support screens open on desktop/phone with no errors.
- [x] Support step 2: granted support@sernetindia.com Service Ratings access; signed in as that staff account and verified ticket create → public reply/first-response timestamp → internal note → in progress → resolved → closed, plus test-rating display and low-rating follow-up completion. No page errors; temporary ticket/replies/rating/audit entries removed and permission retained. Customer rating was represented by a temporary test record; the separate client-portal submission screen was not exercised.
