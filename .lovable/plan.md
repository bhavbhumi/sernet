# One home per product + direct app logins

## Goal
Stop repeating product content across Services, Pricing and product pages. Each product gets one main page; the header Login section sends users straight to the apps.

## 1. Header menu — "Sign up / Login" section
- Login / Portal → unchanged (SERNET client, partner and staff portal)
- Tick Funds → Tick Funds web app login (opens in new tab)
- Tushil → Tushil web app (opens in new tab)
- Choice FinX → two links, clearly marked as Choice's site:
  - "Choice FinX Login" → Choice's official login page
  - "Open Choice account" → SERNET's existing account-opening link
- Small "opens in new tab" icon on every outside link
- Product pages (/tickfunds, /tushil, /choicefinx) stay reachable from Services, Home and footer

## 2. Product pages become the single full source
- /tickfunds — mutual funds/SIF: features, how it works, charges, FAQs, regulatory line, reviews
- /tushil — insurance via Shrigoda: features, claims support, FAQs, referral disclosure
- /choicefinx — trading via Choice Equity Broking (SERNET as AP): features, rates, FAQs, reviews
- Any useful unique content currently only on Services tabs is moved here, not lost

## 3. Services tabs become short overviews
- Trading, Investment, Insurance: short intro, who the partner is, 3–4 key points, "Learn more" button to the product page, plus contact/RM call-to-action
- Investment keeps RM-served products (PMS, AIF, Bonds, FD) since they have no separate page
- Estate Planning and Credit Counselling: unchanged full content
- Tab-specific FAQs trimmed to avoid repeating product page FAQs

## 4. Pricing
- Keeps only charges per tab, with a "Full details" link to each product page
- Removes repeated feature descriptions

## 5. What stays the same
- All existing URLs, tabs (?tab=), forms and redirects keep working
- Regulatory wording continues to come from the single shared source
- Design, mobile layout and verified figures unchanged
- No legal/disclosure content changes

## Verification
- Check header links on desktop and mobile
- Check each Services tab, Pricing tab and product page in preview
- Confirm no broken links or console errors, then publish

## Technical details
- Header: `menuSections` in `src/components/layout/Header.tsx` switched to external links using `src/lib/appLinks.ts`; add `CHOICE_LINKS.LOGIN` constant (verified official URL)
- Services: slim `TradingServiceContent`, `InvestmentServiceContent`, `InsuranceServiceContent`
- Product pages: `TickFunds.tsx`, `Tushil.tsx`, `ChoiceFinX.tsx`; Tick Funds shared content stays in `src/content/tickfunds.ts` (prerendered)
- Record "one home per product" rule in AGENTS.md
