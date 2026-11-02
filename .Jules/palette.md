# Palette's Journal - UX & Accessibility Learnings

## 2026-03-31 - Label in Name Rule for ARIA Labels (WCAG 2.5.3)
**Learning:** When adding `aria-label` to buttons that contain visible text (e.g., "Buy Now"), the accessible label must include the exact visual text string (e.g., "Buy Now: Product Name for Rs. Price") so speech recognition and screen readers can properly match visual input and voice commands.
**Action:** Always prefix or include the exact visual button text when constructing descriptive `aria-label`s for interactive elements with visible labels.

## 2026-10-30 - Modal Dialog Dismissal & Keyboard Navigation (WCAG 2.1.2 & WAI-ARIA Dialog Pattern)
**Learning:** Custom dialog overlays (like `OrderForm`) require window-level `Escape` key listeners and backdrop click handlers (`e.target === e.currentTarget`), along with visible focus indicator styling (`focus-visible:ring-2`) and `type="button"` on close buttons, to ensure keyboard accessibility and prevent trapping users.
**Action:** Always provide `Escape` key dismissal with proper cleanup and backdrop click handling for custom modal overlays, and ensure dismiss buttons are keyboard-focusable with visible focus rings.
