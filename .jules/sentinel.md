## 2026-03-29 - ChartStyle CSS Injection and XSS via dangerouslySetInnerHTML
**Vulnerability:** Unsanitized chart config keys, IDs, and colors were interpolated directly into a `<style dangerouslySetInnerHTML>` block in `src/components/ui/chart.tsx`.
**Learning:** Even internal UI components that render dynamically generated CSS via `<style dangerouslySetInnerHTML>` must sanitize string inputs to prevent attackers from injecting closing `</style>` tags or arbitrary CSS rules.
**Prevention:** Sanitize CSS variable names and selector IDs with alphanumeric/hyphen whitelists (`[^\w-]`) and color values with safe character whitelists before string interpolation into style blocks.
