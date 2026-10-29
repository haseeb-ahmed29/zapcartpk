## 2026-03-29 - ChartStyle CSS Injection and XSS via dangerouslySetInnerHTML
**Vulnerability:** Unsanitized chart config keys, IDs, and colors were interpolated directly into a `<style dangerouslySetInnerHTML>` block in `src/components/ui/chart.tsx`.
**Learning:** Even internal UI components that render dynamically generated CSS via `<style dangerouslySetInnerHTML>` must sanitize string inputs to prevent attackers from injecting closing `</style>` tags or arbitrary CSS rules.
**Prevention:** Sanitize CSS variable names and selector IDs with alphanumeric/hyphen whitelists (`[^\w-]`) and color values with safe character whitelists before string interpolation into style blocks.
# Sentinel Security Journal

## 2026-03-08 - Supabase Client Environment Variable Validation
**Vulnerability:** Supabase client was created directly using `import.meta.env` variables without checking if they are defined. If missing, `createClient` was invoked with `undefined` parameters, causing confusing runtime failures during authentication or query executions.
**Learning:** In frontend client SDKs (like `@supabase/supabase-js`), missing environment configuration at build or runtime should fail fast with clear errors before any network requests or auth operations attempt to run.
**Prevention:** Always validate critical environment variables at client instantiation time before initializing external service SDKs.
