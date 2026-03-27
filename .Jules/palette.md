## 2025-05-15 - Improving SPA Form Predictability
**Learning:** Wrapping input fields in a semantic `<form>` element in a Single Page Application (SPA) provides a high-impact micro-UX win by enabling native "Enter to Submit" behavior. This aligns with user mental models for form interactions and improves keyboard accessibility with minimal code changes.
**Action:** Always prioritize wrapping onboarding and settings inputs in `<form>` elements and use the `submit` event listener instead of `click` on buttons.
