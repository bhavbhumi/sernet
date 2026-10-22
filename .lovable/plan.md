# Open an Account page: four tabs + Express Your Interest

## Goal
One page at `/open-account` where prospects start with any SERNET product. Account opening and KYC stay on each provider's own pages. SERNET collects interest so the team can call back.

## Page layout
```text
Hero (same style as other inner pages)
  Title: Open an account with SERNET
  Subtitle: Invest, insure and trade through trusted partners, with SERNET by your side

Tabs:  Invest | Insure | Trade | CKYC      (deep-link via ?tab=)

Each tab:  left = steps + buttons, then "Check before you start" block
           right = "Express Your Interest" box
```

### Invest tab (Tick Funds)
- Short intro: regular mutual funds and SIF; SERNET is an AMFI-registered distributor (ARN 35275).
- Steps: 1) KYC done? If not, go to the CKYC tab. 2) Sign up on Tick Funds (web). 3) Or download the app (Play Store / App Store).

### Insure tab (Tushil)
- Intro: insurance arranged by Shrigoda Insurance Brokers; SERNET is the referrer.
- Button: "Continue on Tushil" (login / sign-up page).

### Trade tab (Choice FinX)
- Intro: Choice Equity Broking is the broker; SERNET is its partner. Delivery 0.30%, intraday 0.03% both legs for SERNET clients.
- Buttons: "Open a Choice FinX account" (SERNET referral link), "Already a client? Log in".

### "Check before you start" block (same on all four tabs)
  1. Check your KYC status (CVL KRA)
  2. Check your CKYC number (CKYC India)
  3. Check your FATCA status (CAMS)
  4. Verify PAN–Aadhaar link status (CVL)
  5. Link your PAN with Aadhaar (Income Tax portal)
- Line at the end: "KYC not done? Complete Digital CKYC" (links to the CKYC tab).

### CKYC tab
- Short intro on what KYC/CKYC is and why it is needed once for all products.
- **KYC not done?** Button: "Complete Digital CKYC" (UTI MF link whitelisted for SERNET).
- All outside links open in a new tab with a small outside-site icon.

## Express Your Interest box (on every tab)
- Fields: Name, Mobile, Email (optional), City, **Investor type** (Individual, HUF, NRI, Minor, Non-individual), Interested in (pre-ticked for the current tab; can tick more), short message (optional), consent line linking to Terms and Privacy.
- On submit: saved to the Admin enquiries list as "Account opening".
- Success message: "Thank you! Your interest has been recorded. Our team will call you back shortly." (no promised time unless you give one).

## About Zerodha's investor types
A good idea, kept light: instead of separate journeys, investor type is one field in the interest box. Individuals can continue online right away; HUF, NRI, Minor and company/trust clients usually need extra documents, so a note under the box says "Our team will guide you with the documents needed". If you later confirm which providers support these types online, we can add type-specific steps.

## Clean-up
- `/signup` points to this page; old placeholder text ("Free equity delivery trades", "Flat Rs 20", "Free direct mutual funds") and forms that saved nothing are removed.
- Home "Open account" button and header/footer links point here.

## What stays the same
Product pages, Pricing, regulatory wording, design style and existing links.

## Verification
Submit a test interest, confirm it appears in Admin, then remove only that test entry; check all tabs and links on desktop and mobile.

## Technical details
- `src/lib/appLinks.ts`: add `TICKFUNDS_LINKS.SIGNUP`, `TUSHIL_LINKS.LOGIN`, `KYC_LINKS` (UTI CKYC + five check links); reuse `APP_LINKS.OPEN_ACCOUNT` / `LOGIN`.
- `src/content/onboarding.ts`: tab content, investor types, link lists in one place.
- Rewrite `OpenAccount.tsx` with `PageHero` + URL-synced tabs; `/signup` redirects to `/open-account?tab=invest`.
- Insert into existing `leads` table (`lead_type: 'account_opening'`, JSONB context with investor type, products, source tab); confirm public insert-only policy like other enquiry forms.
- Record the onboarding rule in AGENTS.md.
