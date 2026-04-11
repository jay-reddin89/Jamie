## 2025-05-14 - Centralized Form Logic for Multi-step Interactions
**Learning:** Wrapping multi-step onboarding sequences in a single `<form>` and managing the logic via the `submit` event listener significantly improves keyboard accessibility (enabling "Enter" to progress) compared to individual click listeners.
**Action:** Always prefer `<form>` submission for data entry flows, even when the UI presents it as multiple discrete steps or buttons.
