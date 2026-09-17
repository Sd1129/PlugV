# Compare: automatic budgets and mobile simplification

- Prefills catalogue starting ex-showroom price, 3% insurance allowance, ₹1,500 other-charge allowance and zero discounts. Amounts remain editable; unedited percentage estimates follow price changes. Reset restores estimates.
- Telangana is explicitly a state scenario, not inferred location. Official Transport Department dashboard confirms eligible private-EV road tax/registration exemption through 31 December 2026. After expiry the zero-tax default is not applied. Other-state scenario uses an explicitly illustrative 8% allowance, not a statutory rate.
- Insurance allowance is a PlugV planning assumption, not a state-specific insurer premium. Dealer quote, coverage, TCS and other charges require confirmation.
- Shortened hero, placed budgets immediately after pickers, added sticky ex-showroom price-gap summary and real section links. No claim of an overall winner.
- Removed repeated spotlight and model-feature summaries. Retained specifications once; source details and full evidence remain available through disclosures. Methodology uses readable text and shorter bullets.

Source checked 17 September 2026: https://tgtransport.net/onlinedashboard/Dashboard/Flagship.aspx

Validation: release audit passed; browser tests against development and production builds verified prefilled totals, state switching, preserved overrides, reset, sticky offsets at 390px/1365px, disclosure access, removed duplicates, no horizontal overflow and no uncaught JS errors. Final ex-showroom label clarified after visual review.

Limits: defaults are estimates, not current dealer/insurance quotes. Only Telangana has a sourced state exemption preset; other states require overriding the generic allowance. Earlier charging-evidence limitations remain.
