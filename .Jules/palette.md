## 2026-03-31 - Modal Dialog Accessibility and Accessible Form Controls

**Learning:** Custom overlay modal forms need `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `Escape` key dismissal to be fully accessible to screen reader and keyboard users. Additionally, explicit `htmlFor`/`id` linking between form labels and inputs ensures screen readers properly state input contexts.

**Action:** Whenever creating custom modal dialogs or form overlays in React components without external headless libraries like Radix, ensure proper ARIA attributes, keyboard escape listeners, explicit field label associations, and visual submit feedback.
