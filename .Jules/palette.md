## 2025-05-14 - [Accessibility & Keyboard Navigation]
**Learning:** This application used non-semantic `div`s with `pointer` cursor for collapsible sections, making them invisible to keyboard and screen reader users. Additionally, input labels were present but not associated via `for`/`id` attributes.
**Action:** Always convert interactive elements to semantic `<button>` tags and ensure `label` elements are explicitly associated with their inputs. Implement `:focus-visible` with a high-contrast theme variable (like `--accent-cyan`) to provide clear visual feedback for keyboard navigation.
