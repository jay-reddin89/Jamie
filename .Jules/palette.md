## 2025-05-15 - Multi-step Keyboard Navigation
**Learning:** Wrapping a sequence of inputs and action buttons in a <form> element enables native 'Enter' key submission. By handling the 'submit' event and toggling the logic based on the application state (e.g., whether a secondary button is visible), we can provide a smooth, multi-step onboarding experience for keyboard users without complex custom event listeners.
**Action:** Always prefer <form> elements for user input sequences and use the 'submit' event to manage multi-step flows.
