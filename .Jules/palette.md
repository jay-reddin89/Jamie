## 2025-05-22 - Improving Form Accessibility and Keyboard Usability

**Learning:** In utility-heavy or custom-styled UIs, developers often suppress default browser outlines for aesthetics using `outline: none`. This severely impacts keyboard accessibility. Additionally, missing `<form>` wrappers and disconnected `<label>` elements degrade the experience for screen readers and power users who rely on the "Enter" key for submission and label-to-input focusing.

**Action:** Always ensure interactive elements have a high-contrast `:focus-visible` style that is not suppressed by global `outline: none`. Use semantic `<form>` wrappers and explicit `for`/`id` label associations to enable native browser behaviors like "Enter-to-submit" and increased hit-areas.
