## 2025-05-14 - Global Focus Accessibility
**Learning:** Explicit label-input associations via `for` and `id` significantly improve mobile user experience by expanding tap targets. Additionally, global `:focus-visible` styles are often blocked by explicit `outline: none` on specific components.
**Action:** Always ensure labels are properly associated with inputs. When implementing global focus styles, audit existing CSS for `outline: none` and remove it to let global accessibility styles through.
