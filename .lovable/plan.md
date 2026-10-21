# Insights Posts: organisation, SEO and reader-to-client journeys

## Recommendation

Keep your six subject tabs. They are a strong fit for SERNET and make the library easier to browse than separating everything into Articles and Analysis. The important refinement is to separate **what a post discusses**, **how it is presented**, and **which recurring series it belongs to**.

This is a planning proposal only. No website pages, post classifications, article text, images, publication dates or links have been changed. Implementation starts only after approval.

### What the review found

- The published library contains **1,020 posts: 427 Articles, 586 Analysis, 2 Awareness and 5 Reports**. These existing labels describe editorial kind, not your proposed subject types.
- There are **499 posts without a subcategory**, inconsistent category names, and recurring-series labels mixed with subject labels. Three repeated-title groups need comparison; repeated titles alone do not justify deletion.
- Current public category filters are hardcoded. The administrative list can retrieve only 1,000 rows in one request, so a classification exercise must explicitly retrieve all 1,020.
- Article-specific sharing metadata already exists, but initial HTML does not yet contain the full article body. Individual posts are absent from the static sitemap, and existing SEO override fields are not consistently used.
- Existing covers, article layouts and IPO calls to action should be preserved, not regenerated or overwritten.

The [Invoicemonk reference](https://invoicemonk.com/en/blog/the-10-best-personal-finance-blogs) is now a list of 16 blogs despite its URL. Its useful lesson is audience-focused writing and clear reader needs—not copying its taxonomy or treating it as an Indian regulatory reference.

## 1. Classification model

| Layer | Purpose | Example |
|---|---|---|
| Subject type | Six main tabs | Investment |
| Category | Main product/topic family | Mutual Funds |
| Subcategory | Principal subject within that family | Equity |
| Tags | More specific, reusable descriptors | Large Cap, Index Funds, ETF |
| Editorial kind | Existing Articles / Analysis / Awareness / Reports | Analysis |
| Media format | Text / Image / Audio / Video | Text |
| Series | Recurring publication identity | Market Wrap, Triggers Weekly |

Give every post one primary subject/category path. Allow relevant secondary tags and related links, rather than publishing duplicate copies under different topics. Optional fields can remain empty when they add no useful distinction.

For example, **ETF** is a structure spanning equity, debt and gold—not exclusively an equity subcategory. A weekly market wrap is **Macro & Markets → Markets → Updates**, with **Market Wrap** as its series.

## 2. Proposed taxonomy

### Macro & Markets

- **Macro:** Economy; Policy & Regulation; Union Budget.
- **Markets:** Updates; Market Impact; Triggers; Outlook.
- Useful tags: inflation, GDP, interest rates, monetary policy, fiscal policy, global markets, earnings and liquidity.
- Keep Market Wrap and Triggers Weekly as series. Distinguish market-wide sector developments here from company/sector investing analysis under Trading.

### Investment

- **Mutual Funds:** Equity; Debt; Hybrid; Solution-Oriented; Other Schemes.
  - Tags where applicable: Large Cap, Mid Cap, Small Cap, Flexi Cap, Multi Cap, ELSS, Index Funds, ETF and Fund of Funds. Validate scheme classifications against current authoritative sources during mapping.
- **Specialized Investment Funds (SIF):** distinct from ordinary mutual-fund scheme categories; classify using applicable SIF strategy terminology after checking the relevant framework. Do not force SIF into the five ordinary MF scheme groups.
- **PMS:** Discretionary; Non-Discretionary; Advisory; PRIM.
  - Advisory describes the provider's service, never SERNET's regulatory status.
  - PRIM means **Portfolio Managers Route for Investing in Mutual Fund Units**. A September 2026 SEBI board announcement was located; operative rules and provider availability remain unverified. Treat it as an educational topic until those checks are complete, not an available SERNET offering.
- **AIF:** Category I; Category II; Category III.
  - Tags: private equity, private debt, venture capital, infrastructure and other verified strategies. Do not assign unusual strategies such as art to a regulatory category by assumption.
- **Bonds & Fixed Income:** Government & Sovereign; Corporate; Deposits.
  - Separate tags for issuer, structure and tax treatment: perpetual, market-linked debentures, green/ESG debt, tax-free, secured/unsecured and fixed deposits. These dimensions overlap; they are not mutually exclusive bond categories.
- **Precious Metals:** Gold; Silver.
  - Tags: bars, coins, jewellery, ETF, fund, EGR and digital gold, as relevant. Explain different costs and protections; EGR and digital gold must not be represented as equivalent regulated products.
- **Real Estate:** Direct Property; REITs & Property Funds.
  - Direct-property tags: land, building/unit, residential, commercial, industrial and agricultural. This avoids mixing an asset's physical form, use and investment vehicle in one category level.

### Insurance

- **Life Insurance:** Term; Traditional; ULIP; Group Life.
- **Health & Personal Protection:** Mediclaim; Critical Illness; Personal Accident; Travel & Overseas Cover; Group Health.
- **General Insurance:** Motor; Property / Fire & Burglary; Marine.
- **Business & Liability Insurance:** Professional Indemnity; Surety; Directors & Officers Liability.
- Use correct spellings: Mediclaim, Burglary, Surety. Group these for reader navigation without implying they replace an insurer's legal product classification.

### Trading

- **Stocks & Equity Markets:** IPOs; Stocks; Sectors; Industries.
- **Commodities:** Energy; Agriculture; Base Metals; Precious Metals.
- **Currency:** Currency Derivatives; Hedging & Risk; Currency Market Updates.
- Use instrument/strategy tags for futures, options and technical concepts when relevant.
- IPO company notes belong primarily here, rather than remaining split under Investment and IPO Basket. Keep IPO Basket as a recognisable tag/series if useful.
- Weather can be an educational topic, but do not present a tradable weather product or a supported Choice segment without verification. Currency coverage must not imply unrestricted offshore forex trading.

### Credit

- **Secured Borrowing:** Home Loan; Car Loan; Loan Against Property; Loan Against Mutual Funds (LAMF); Loan Against Securities (LAS); Loan Against Precious Metals (LAPM: Gold & Silver).
- **Other Borrowing:** Personal; Education; Business; Working Capital; Overdraft.
  - Rename your proposed “Unsecured Loans” group: business, education, working-capital and overdraft facilities may be secured or unsecured. Use secured/unsecured as a tag when established by the article.
- **Credit Counselling:** Credit Profile; Borrowing Capacity; Repayment; Debt Management.
- Confirmed current service scope: SERNET arranges **LAMF, LAS and LAPM only**. All other loan topics invite credit-counselling enquiries, not loan-arrangement promises.

### Personal Finance

- **Risk & Portfolio Planning:** Risk Profile; Asset Allocation; Strategy; Review; Rebalancing.
- **Budgeting & Money Management:** Cash Flow; Net Worth; Emergency Fund; Debt Management.
- **Financial Goals:** Tax Planning; Retirement; Education; Lifestyle Goals.
- **Legacy & Estate Planning:** Wills; Trusts; Succession.
- Planning/rebalancing content remains educational and consistent with distributor scope. Avoid implying SERNET provides regulated investment advisory or tax/legal advice merely because an article covers it.

**Boundary rule:** classify by the question the article answers. An insurance-company results analysis belongs under Stocks, while an explanation of life cover belongs under Insurance. Gold price movements may be Markets/Trading; long-term gold allocation belongs under Investment. Add cross-links instead of competing copies.

## 3. Listing experience

- Keep Insights as the main library and introduce **All Posts** plus the six subject tabs. Keep editorial kind, media format and series as secondary filters rather than competing primary tabs.
- Show relevant categories and then subcategories for the selected subject; avoid displaying the whole taxonomy at once. Tags remain optional further refinements.
- Add title/topic search, newest-first ordering and genuine publication dates. Series identity can appear alongside the subject label without replacing it.
- Cards show the complete cover, full wrapping title, concise excerpt, primary topic, date and author. Preserve existing covers and stable image frames; no cropping of printed text.
- On phones, tabs remain scrollable and deeper filters compact. On tablets/desktops, use the established container and card grid. No tiny labels, overlapping controls or empty filter/index panels.
- Opening a post and returning should restore the reader's subject, filters, page and scroll position. Provide addressable filtered states for sharing, without automatically indexing every combination.

## 4. Detail experience and useful conversion

- Show breadcrumbs: **Insights → Subject → Category → Article**, plus a return link to the originating filtered list.
- Preserve the cover/topic-index sidebar on tablet/desktop. On phones, show the complete cover and show a topic index only when headings exist.
- Show author, sources and genuine report/publication date. Add reviewer credentials and review dates only when actually supplied and verified; never invent expertise badges or use deployment dates.
- End with a short related-reading section and **one contextual action section**. Avoid a generic sales banner repeated inside the article or several competing buttons.

| Post context | Prospective client action | Existing client / supporting action |
|---|---|---|
| IPO / stock trading | Open a free account through the existing Choice referral link | Log in to Choice FinX; retain approved broker/AP wording |
| Mutual funds | Explore Tick Funds / begin through its portal | Tick Funds login; Regular Plan and provider-remuneration context |
| SIF | Eligible-investor enquiry, or verified portal journey | Do not imply ordinary MF eligibility or unverified portal capability |
| PMS / AIF / bonds / deposits | Enquire with the relationship manager | Relevant product information and disclosures; no invented app journey |
| Insurance | Explore Tushil / request an insurance referral | Tushil portal; Shrigoda broker identity and referral relationship |
| LAMF / LAS / LAPM | Enquire about the relevant borrowing facility | Lender approval/terms context; no invented lender or approval promise |
| Other loans | Request credit counselling | Related repayment/credit guides |
| Wills / trusts / succession | Estate-planning enquiry | Relevant service overview; professional legal execution where applicable |
| Macro / general education | Relevant guide or calculator; enquiry only where genuinely appropriate | Related series/posts; no forced trading pitch |

Use one configurable action per article with sensible topic defaults and an editorial override. Do not append sales text into all article bodies. Before introducing this shared section, detect the existing **73 IPO article-end CTAs** and preserve their approved wording and links without displaying duplicates.

Every article should link naturally to a few genuinely related posts and the relevant existing product/service page. Breadcrumbs and category links provide the back links; links must not be added merely to hit a numerical target.

## 5. SEO and safeguards

- Preserve existing UUID article URLs and historical publication dates. Do not rewrite URLs merely to include category names; friendly URLs can be a separate future decision.
- Reconcile article/analysis alternate routes to one canonical destination and preserve working old links.
- Build useful subject/category hubs with substantive introductions and actual posts. Do not create hundreds of thin, empty or duplicate tag pages.
- Make full article content, accurate metadata and Article/BlogPosting + breadcrumb structured data available in initial HTML using the same CMS content and shared rendering—not a second editable article copy.
- Use reviewed CMS SEO overrides consistently, with title/excerpt fallbacks. Keep cover-specific social previews, stable canonical URLs and correct original publication timestamps.
- Include canonical published posts and approved useful hubs in a generated sitemap. Use genuine modification times, not publish/deployment times as fabricated freshness.
- Add financial-content safeguards: sources, limitations, relevant remuneration/disclosure links and clearly distinguished fact, interpretation and opinion. Neither structured data nor the reorganisation guarantees rankings or leads.
- Track article-to-product clicks and successful enquiries without collecting personal details in analytics. Measure enquiry quality, not clicks alone.

## 6. Execution sequence after approval

1. **Classification audit:** export all posts read-only and produce a mapping register with old path, proposed subject/category/subcategory, tags, series, CTA and review flag. Classify by title/body, not old category alone. Present a representative sample across all six subjects for review.
2. **Shared organisation:** establish controlled, centrally maintained topics and tags in the CMS; keep editorial kind, media format and series separate. Introduce backend pagination so the full inventory is manageable.
3. **Presentation:** implement listing filters, preserved navigation state, breadcrumbs, related reading and contextual actions. Validate one representative post per available subject, short/no-heading posts, long titles and existing IPO CTAs.
4. **Approved mapping:** apply the reviewed classifications in reversible batches. Preserve article bodies, images, dates, publication state and routes except specifically approved CTA deduplication.
5. **SEO and verification:** check initial HTML and rendered pages, sitemap/canonical consistency, sharing images, all enquiry/login destinations, accessibility, light/dark themes and layouts at 320/390/889/1280px.
6. **Preview approval, then publication:** report classification totals, exceptions, changed fields and test results. Publish only after explicit approval.

## Technical implementation notes

- Preserve `articles.content_type` for existing publishing logic. Store the six editorial subjects separately, using shared taxonomy identifiers and article–tag relationships; avoid free-text drift and browser-only category trees.
- Use the established query, permissions, theme and component patterns. Changes must not affect Updates feeds, support articles, legal documents, forms or external integrations.
- Generate full-body prerendering, schema and metadata from the same normalised CMS article source. Verify alternate routes and legacy IDs before adding redirects.
- Add focused tests for classification boundaries, CTA service eligibility, historical date preservation, pagination completeness and canonical destinations. Verify actual click/enquiry flows rather than only compilation.

## References and remaining validation

- [Google: people-first content and financial-content trust](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: URL structure](https://developers.google.com/search/docs/crawling-indexing/url-structure)
- [Google: faceted navigation](https://developers.google.com/crawling/docs/faceted-navigation)
- [Google: Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [SEBI: September 2026 board announcement including PRIM](https://www.sebi.gov.in/sebi_data/attachdocs/sep-2026/1790259036651.pdf)
- [SEBI: caution concerning digital gold](https://www.sebi.gov.in/media-and-notifications/press-releases/nov-2025/caution-to-public-regarding-dealing-in-digital-gold-_97676.html)

This is an organisation and SEO review, not legal certification. PRIM implementation/provider availability, any newly promoted product journey and final body-level classifications must be verified before applying their respective parts.