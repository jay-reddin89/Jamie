## 2025-05-22 - [Semantic Accessibility and Keyboard UX]
**Learning:** Converting non-semantic interactive divs to buttons is crucial for keyboard accessibility but requires a "reset" CSS pattern to avoid breaking existing styles. Additionally, standardizing focus indicators with theme variables ensures accessibility is visually integrated rather than feeling like an afterthought.
**Action:** Use a reusable `.btn-reset` class when converting interactive elements to buttons and always implement themed `:focus-visible` styles.
