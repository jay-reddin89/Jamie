## 2025-03-08 - Improving Onboarding Accessibility
**Learning:** The primary onboarding form lacked explicit label-input associations, which is a critical accessibility barrier for screen reader users and reduces the tap target area for mobile users. Decorative SVGs without aria-hidden can also create noise for assistive technologies.
**Action:** Implemented 'for' and 'id' attributes on all onboarding form fields and added 'aria-hidden="true"' to the settings icon.
