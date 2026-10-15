# Compliance gap fixes — Tick Funds, Charter, testimonials

## What I verified

| # | Finding | Verified? | Where it appears |
|---|---|---|---|
| 1 | Wrong ARN 274029 | Yes — wrong | Tick Funds page disclaimer, Services → Investment disclaimer, Network → Principals "Fund Houses" card (also shows a wrong "valid till 22-Feb-2028"). Correct: ARN 35275, EUIN E025145, valid until 28 Oct 2028 (AMFI-confirmed). |
| 2 | Stockbroker duties in the charter | Partly — our Investor Charter has none. The wrong signals are elsewhere: About → Media item "Sernet India registered with SEBI as a stockbroker", and testimonials saying "switched from a big-name broker", "equity investments", "research reports". Broking on the Principals page is correctly described as the partner's (Choice) service. |
| 3 | ₹10,000 Cr+ AUM / 5 lakh+ investors | Yes — unsupported | Tick Funds page (twice) and Services → Investment. No source in our records; likely platform/partner figures. |
| 4 | Unverified testimonials | Yes | Home page has 6 built-in sample testimonials shown if none load (made-up names, claims like "outperform the market", "investment advisory"). The reviews list has 19 approved entries, 13 with source "website" and no proof link. |
| 5 | "Personalised advisory" / rebalancing | Yes | "Regular Plans with Personalised Advisory", "experienced advisory team… recommend improvements", "Personalised recommendations from our expert team", "rebalance and optimize". The Charter's review section is already worded correctly (investor decides). |
| 6 | Onboarding sends users to Choice FinX | Yes | Step 1 "Download the Choice FinX app" on Tick Funds, Services → Investment, Services → Insurance and Tushil pages. |
| 7 | Old Tick Funds page indexed | Partly | /tick-funds (and any unknown address) shows a page with an OK status, so search engines can index it as a duplicate. Tick Funds' search description also says "zero commission", which is wrong for regular plans. |

## Actions

1. Replace every ARN 274029 with ARN 35275 / EUIN E025145 / valid until 28 Oct 2028, read from the one shared registration record so it can't drift again.
2. Remove the "SEBI stockbroker" Media item (or reword it as a historical note if you confirm it's true for SERNET). Charter stays as is.
3. Remove the AUM and investor-count figures and replace them with facts we can prove: "AMFI-registered since 2006", "APMI-registered PMS distributor", "Empanelled with 13+ fund houses".
4. Delete the 6 built-in sample testimonials. When there are no verified reviews, the section hides. Add a short note under reviews: "Individual experiences; not indicative of future returns." The 13 "website" reviews stay hidden until you confirm they are real clients with consent (see questions).
5. Reword to distributor language: "Regular plans with relationship-manager support", "Free portfolio review", "Observations from our distribution team for your decision", "Periodic reviews to help you decide whether to rebalance". Remove "advisory" claims from testimonials.
6. Platform map, shown on each page:
   - Tick Funds (web + app) — Mutual Funds, SIF; PMS/AIF/Bonds/FD via relationship manager
   - Tushil — Insurance (referral to licensed broker)
   - Choice FinX — Trading/broking, offered by the partner, not SERNET
   Onboarding steps point to the right app for each.
7. Redirect /tick-funds and similar old addresses to /tickfunds; mark unknown pages "do not index"; fix the Tick Funds search description (remove "zero commission").

## Need your confirmation

- Is the "SERNET registered with SEBI as a stockbroker" news item true history? (Remove vs. mark historical.)
- Can you confirm the 13 "website" reviews are real clients who agreed to be shown? Otherwise I'll hide them.
- Which exact old Tick Funds address did the reviewer find (e.g. on tickfunds.sernetindia.com or a WordPress page)? I can only fix addresses on this site.
- Is PMS/AIF/Bonds/FD actually available inside the Tick Funds app, or only via relationship manager?

## Technical details

- Files: TickFunds.tsx, InvestmentServiceContent.tsx, InsuranceServiceContent.tsx, Tushil.tsx, PrincipalsNetworkContent.tsx, Media.tsx, TestimonialSection.tsx, ReviewsContent.tsx, App.tsx (redirects), NotFound.tsx (noindex), SEOHead description.
- Registration values imported from `distributorRegistrations` in legalConfig.ts.
- Reviews: keep the query, drop `fallbackTestimonials`, hide section on empty; optionally filter `source != 'website'` pending confirmation.
- Verify with Playwright on each page, then publish.
