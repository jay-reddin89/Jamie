## 2025-05-15 - Modal Interaction Missing
**Learning:** Icon-only triggers for modals often lack associated keyboard and pointer-dismissal patterns (Escape key, click-outside) in this codebase, leading to a "trapped" feeling for users.
**Action:** Always implement global Escape listeners and overlay click-dismissal when adding or improving modal components.
