# Sentinel Security Journal

## 2026-11-11 - Supabase URL Protocol & Cleartext Transmission Validation
**Vulnerability:** The Supabase client initialized directly with `SUPABASE_URL` from environment variables without protocol scheme validation, risking CWE-319 cleartext transmission of API keys, JWT access tokens, and authenticated session data if an insecure `http:` or non-HTTP scheme was configured.
**Learning:** Checking for environment variable presence (`!SUPABASE_URL`) is insufficient. Client SDK initializers that send authentication credentials over network requests must explicitly enforce TLS/HTTPS protocols (allowing `http:` only for local development hostnames like `localhost`/`127.0.0.1`).
**Prevention:** Validate URL format and scheme using `new URL()` and check protocol whitelist (`https:` or local `http:`) during client instantiation.

## 2026-03-29 - ChartStyle CSS Injection and XSS via dangerouslySetInnerHTML
**Vulnerability:** Unsanitized chart config keys, IDs, and colors were interpolated directly into a `<style dangerouslySetInnerHTML>` block in `src/components/ui/chart.tsx`.
**Learning:** Even internal UI components that render dynamically generated CSS via `<style dangerouslySetInnerHTML>` must sanitize string inputs to prevent attackers from injecting closing `</style>` tags or arbitrary CSS rules.
**Prevention:** Sanitize CSS variable names and selector IDs with alphanumeric/hyphen whitelists (`[^\w-]`) and color values with safe character whitelists before string interpolation into style blocks.

## 2026-03-08 - Supabase Client Environment Variable Validation
**Vulnerability:** Supabase client was created directly using `import.meta.env` variables without checking if they are defined. If missing, `createClient` was invoked with `undefined` parameters, causing confusing runtime failures during authentication or query executions.
**Learning:** In frontend client SDKs (like `@supabase/supabase-js`), missing environment configuration at build or runtime should fail fast with clear errors before any network requests or auth operations attempt to run.
**Prevention:** Always validate critical environment variables at client instantiation time before initializing external service SDKs.
