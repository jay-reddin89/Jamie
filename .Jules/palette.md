## 2026-03-05 - Ensuring Accessible Focus States
**Learning:** In applications where `outline: none` is globally or specifically applied to interactive elements (like `.settings-icon`), it is necessary to use `:focus-visible` with `!important` to reliably restore a themed focus indicator for keyboard users.
**Action:** Always check for `outline: none` on custom buttons and provide a high-contrast `:focus-visible` override using theme variables like `--accent-cyan`.
