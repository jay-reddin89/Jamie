## 2025-05-14 - Accessible Collapsible Sections
**Learning:** In a dashboard with many dynamic, collapsible sections, using non-semantic divs for headers prevents keyboard users from navigating or interacting with the content. Adding ARIA attributes (expanded/controls) without semantic elements is insufficient; <button> is required for proper focus management.
**Action:** Always wrap collapsible headers in <button> elements and use a global counter to generate unique IDs for content association via aria-controls.
