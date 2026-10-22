# One "Open an account" page for all SERNET products

## Goal
One starting point at `/open-account` for prospects. SERNET collects a short enquiry, then sends each person to the right provider's own sign-up page. KYC and account opening stay with the providers.

## About Zerodha's investor-type split
Splitting by investor type is a good idea for SERNET too, but for a different reason. Zerodha does the onboarding itself, so each type gets its own flow. For SERNET, the type decides **where the person goes**:
- **Individual (resident):** fully online. Use the provider links below.
- **HUF, NRI, Minor, Non-individual (company, partnership, LLP, trust):** these usually need extra documents, and the provider pages may not support them online. They go to an assisted path: a document checklist plus "Your relationship manager will call you".
- When a provider confirms online support for a type (for example NRI on Tick Funds), we switch that type to the online links. Nothing is claimed until confirmed.

## Page flow
```text
Step 1  Who is investing?   Individual | HUF | NRI | Minor | Non-individual
Step 2  What do you want?   Invest (Tick Funds) | Insure (Tushil) | Trade (Choice FinX)   [multi-select]
Step 3  Your details        Name, mobile, email, city (no PAN, no documents)
Step 4  Next steps          Personalised checklist with buttons
```

### Step 4, Individual
1. **Complete your KYC (if not done)**: UTI MF Digital CKYC link whitelisted for SERNET. Shown for Invest. Note: one KYC works across fund houses.
2. **Invest:** "Sign up on Tick Funds" (web sign-up) + Play Store / App Store buttons.
3. **Insure:** "Continue on Tushil" (login / sign-up page). Note: insurance is arranged by Shrigoda Insurance Brokers; SERNET is the referrer.
4. **Trade:** "Open a Choice FinX account" (SERNET referral link). Note: Choice Equity Broking is the broker; SERNET is its partner.
- Each button opens in a new tab and is marked as an outside site.

### Step 4, HUF / NRI / Minor / Non-individual
- Short document checklist per type (for example HUF deed and Karta KYC; NRI passport, overseas address, NRE/NRO bank; Minor birth proof and guardian KYC; company board resolution, PAN and authorised signatory KYC).
- "We'll call you within one working day" plus sales number +91 92067 67670.
- Checklists are a starting draft to be confirmed by your team before publishing.

## Lead capture
- Step 3 saves an enquiry (investor type, products chosen, contact details, source page) to the existing enquiries list in Admin, so the RM can follow up even if the person leaves at the provider's page.
- Clear consent line linking to Terms and Privacy.

## Clean-up
- `/signup` and `/open-account` show this same page (one home). Remove the old placeholder text ("Free equity delivery trades", "Flat Rs 20", "Free direct mutual funds") and the forms that saved nothing.
- Home "Open account" button, header and footer links point here.
- Header "Sign up / Login" keeps the direct product logins already in place.

## What stays the same
- Product pages, Pricing, regulatory wording, design style and existing links.

## Open items for you
- Confirm the document checklists for HUF, NRI, Minor and Non-individual.
- Tell us which providers support these types online, if any.
- Ask providers later for prefilled referral links or status tracking.

## Technical details
- Add `TICKFUNDS_LINKS.SIGNUP`, `TUSHIL_LINKS.LOGIN`, `KYC_LINKS.UTI_CKYC` to `src/lib/appLinks.ts`; reuse `APP_LINKS.OPEN_ACCOUNT`.
- New `src/content/onboarding.ts`: investor types, product options, per-type checklists, routing rule (`online` vs `assisted`), so rules live in one place; small unit test for routing (Individual → online; others → assisted).
- New stepper page replacing `OpenAccount.tsx` and `Signup.tsx`; `/signup` redirects to `/open-account`.
- Insert into existing `leads` table with `lead_type: 'account_opening'` and JSONB context; check RLS allows public insert as other enquiry forms do.
- Record the onboarding routing rule in AGENTS.md.
