## 2025-05-14 - [Inaccessible Input-Label Patterns]
**Learning:** The application's input section consistently lacked explicit associations between <label> and <input> elements, which is a common but high-impact accessibility oversight. Fixing this across the main input form ensures screen readers correctly announce field purposes and improves the touch target size for mobile users.
**Action:** In this design system, always verify that dynamically rendered and static form fields use the 'for' attribute to link labels to their corresponding IDs.
