## 2025-05-14 - [Layout Regression with Reset Buttons]
**Learning:** Applying `display: block` to a utility `.btn-reset` class can break layouts that rely on other display properties (like `flex`) being applied to the same element.
**Action:** Keep `.btn-reset` free of `display` properties or use `display: inherit` to allow composition with other layout classes like `.flex-row`.
