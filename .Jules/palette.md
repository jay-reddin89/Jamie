## 2026-03-28 - Progressive Multi-Step Form Submission
**Learning:** Wrapping a multi-step onboarding flow (where buttons appear sequentially) in a single `<form>` with a branched `submit` handler enables native 'Enter to Submit' behavior across all steps without needing complex state management or focus-trapping. Checking for the presence of the 'hidden' class on the next-step button is an effective way to determine the current submission context.
**Action:** Always prefer wrapping sequential action buttons in a `<form>` and using the `submit` event to drive progression in SPAs.
