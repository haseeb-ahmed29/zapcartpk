# Palette's Journal - UX & Accessibility Learnings

## 2026-03-31 - Label in Name Rule for ARIA Labels (WCAG 2.5.3)
**Learning:** When adding `aria-label` to buttons that contain visible text (e.g., "Buy Now"), the accessible label must include the exact visual text string (e.g., "Buy Now: Product Name for Rs. Price") so speech recognition and screen readers can properly match visual input and voice commands.
**Action:** Always prefix or include the exact visual button text when constructing descriptive `aria-label`s for interactive elements with visible labels.
