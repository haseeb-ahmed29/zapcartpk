## 2026-03-30 - Accessible Modal Dialogs & Form Field Associations
**Learning:** In custom modal overlays without Radix Dialog wrappers, manually providing `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and associating `<label htmlFor="...">` with `<input id="...">` ensures screen readers properly navigate and announce form fields and validation errors.
**Action:** Always link labels to input IDs and include `aria-invalid`/`aria-describedby` when building custom modal forms.
