# Consolidate investment calculators under Funds

## Navigation and order

Keep the existing Trading, Investment and Insurance tabs. Within **Investment**, replace the separate SIP and Lumpsum options with **Funds**, leaving Goal Planner and Bonds available separately.

Funds opens with Lumpsum selected and presents these groups in exactly this order:

1. **Lumpsum**
2. **SIP · STP · SWP**
3. **Step-up SIP · STP · SWP**
4. **Step-down SIP · STP · SWP**

Within each recurring-plan group, select SIP, STP or SWP using a compact selector. This provides all ten calculators without a crowded row of ten tabs. Preserve the clean site styling and make the controls fit comfortably on phones.

## Calculators

| Calculator | Inputs | Main results |
|---|---|---|
| Lumpsum | Investment, assumed annual return, duration | Final value, invested amount, estimated gain |
| SIP | Instalment, frequency, assumed annual return, duration | Contributions, estimated gain, final value |
| STP | Initial source-fund balance, transfer amount, frequency, source and destination return assumptions, duration | Remaining source balance, destination value, total portfolio value, total transferred |
| SWP | Starting corpus, withdrawal amount, frequency, assumed annual return, duration | Total withdrawn, remaining corpus, corpus exhaustion date if applicable |

Step-up and step-down versions use the same inputs plus an **annual change**, selectable as a percentage or fixed rupee amount. The adjustment applies to the SIP contribution, STP transfer or SWP withdrawal—not the assumed return. Keep instalment frequency separate from the annual adjustment frequency.

## Results and value additions

- Live results, a balance chart and an expandable period-by-period cash-flow table.
- STP shows both funds separately: a transfer is not counted as new money or investment profit.
- SWP shows withdrawals separately from investment returns; taking money out is not itself a gain.
- Never permit negative transfers, withdrawals or balances. Cap the final STP/SWP payment at the available balance and clearly report any shortfall or exhaustion.
- Step-down amounts have a zero floor; percentage decreases cannot exceed 100%.
- Retain the existing printable proposal flow, including selected inputs and assumptions.
- Include relevant Tick Funds/Open Account links using existing destinations.

## Assumptions and safeguards

- Use a consistent effective annual-return assumption across Funds calculators, converted to the selected payment frequency.
- Default recurring payments to the beginning of each period and state that assumption in the calculation notes.
- Apply annual step changes after each completed year; the first year uses the entered starting amount.
- Show projections as illustrative, not guaranteed returns or personalised advice.
- Do not invent tax estimates: STP source-fund redemptions and SWP withdrawals may attract tax and exit loads, which are excluded from the initial projections and explicitly disclosed.
- All calculations remain local and deterministic, with no AI services.

## Technical implementation and verification

- Reuse the existing calculator presentation and proposal flow; introduce a shared Funds calculation engine rather than ten separate formula implementations.
- Preserve existing SIP/Lumpsum integrations and prefills where they are reused elsewhere.
- Update calculator page metadata to reflect Funds and the new plan types.
- Add numerical regression tests for all ten modes, zero returns, annual step boundaries, source-fund exhaustion, withdrawal exhaustion and prevention of double-counting STP transfers.
- Verify the complete flow on desktop and mobile, including switching modes, changing inputs, tables, charts and printable proposals.
- No changes to other calculators, content publication or production deployment.