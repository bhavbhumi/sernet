# Client Portal: five tabs

Tabs, in this order: **Profile | Risk Profile | Suitability | Review | Tickets**. Each tab can be opened directly from a link.

## 1. Profile
- Keep the existing fields: name, phone, PAN, city, state, gender, date of birth.
- Add investor type (Individual, HUF, NRI, Minor, Non-individual) and tax status.
- PAN is shown partly hidden.
- The KYC badge stays as set by the team, with the "Before you start" check links next to it.

## 2. Risk Profile
- A questionnaire of about 10 multiple-choice questions: age, income stability, investment horizon, experience, reaction to a fall in value, share of savings invested, and similar.
- Each answer has a score. The total maps to one label: **Conservative, Moderately Conservative, Moderate, Moderately Aggressive, Aggressive**.
- The result shows the label, the date it was taken, and a short note on what the label means.
- The client can retake it. Each attempt is saved, so there is a history.
- The team can see the result in Admin.
- The wording says this is SERNET's own assessment for distribution purposes, and that it is not investment advice.

## 3. Suitability and interest
- A list of the products SERNET distributes or refers: Mutual Funds/SIF, PMS, AIF, Bonds (Altifi), Company FD, Insurance (Tushil), Trading (Choice FinX), Estate Planning, Credit Counselling, Tax Filing (Quicko).
- Each product shows a tag of "Generally suited", "Review with RM" or "Higher risk for your profile", based on the client's risk label. Products that don't depend on risk (insurance, estate planning, tax filing) show no tag.
- The client ticks the products they are interested in and submits.
- Each submission creates one lead for the team (`lead_type: portal_interest`) and updates the client's saved choices.
- If the risk profile hasn't been done yet, the tab asks the client to take it first. The client can still tick interests.

## 4. Review
- The client gives a 1–5 star rating, a written review, and their city and occupation (optional).
- It goes in as **pending**. It shows publicly only after the team approves it in the existing Admin Reviews page. The team already handles reviews this way.
- Reviews from the portal are marked "Verified client".
- One review per client, which they can edit while it is still pending.

## 5. Tickets
- The existing list stays, plus a detail view showing replies and a reply box (from the existing ticket replies).

## Out of scope
- Holdings or portfolio values from the providers.
- Document uploads.
- Relationship-manager assignment.

## Technical details
- New table `risk_profiles` (user_id, answers jsonb, score, label, created_at). RLS: the client can insert and read their own rows; admins can read all. The label is computed from the score by a trigger, so it can't be faked from the browser.
- New table `client_interests` (user_id unique, products text[], updated_at). The client can read, insert and update their own row; admins can read all.
- `reviews`: add a nullable `user_id` column. Add a policy letting an authenticated user insert or update their own pending review. Status is forced to pending by a trigger.
- `profiles`: add `investor_type`.
- Questions, scores, the label mapping and the suitability matrix live in `src/content/riskProfile.ts`. Unit tests cover the score bands, the label mapping and suitability.
- Admin: the leads drawer shows portal interests; the Contacts/Leads view shows the latest risk label.
