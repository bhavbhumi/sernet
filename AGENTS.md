# Architecture rules

- Keep Legal & Compliance documents in the existing `legal_pages` CMS, with shared navigation metadata in `src/lib/legalConfig.ts`; this keeps public and administrative sections aligned without duplicating legal documents.
- Redirect legacy legal URLs to the corresponding unified `/legal?tab=` section, while keeping Investor Charter standalone; this prevents conflicting copies while preserving existing links.
- Render CMS legal HTML through the shared sanitized `LegalDocument` with generated section anchors; this preserves readable content while blocking executable HTML and keeping section navigation stable.
- Keep product empanelments and commission download links within the consolidated disclosures CMS document, using uploaded asset URLs; this allows administrators to maintain verified provider information without a second data source.